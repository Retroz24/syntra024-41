import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, Mail, ArrowLeft } from 'lucide-react';

interface SimpleAuthProps {
  onSuccess: () => void;
}

export default function SimpleAuth({ onSuccess }: SimpleAuthProps) {
  const [step, setStep] = useState<'auth' | 'verification'>('auth');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const cleanupAuthState = () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem('syntra_auth_code');
    } catch (error) {
      console.warn('Error during cleanup:', error);
    }
  };

  const sendVerificationCode = async (email: string) => {
    try {
      const response = await fetch(`${window.location.origin}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification code');
      }

      const data = await response.json();
      console.log('Verification code sent:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !validateEmail(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!password.trim() || password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Error during cleanup signout:', err);
      }

      const trimmedEmail = email.trim().toLowerCase();

      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Try registering if you're new.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login Failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        if (data.user) {
          setIsSuccess(true);
          toast({
            title: "Welcome Back!",
            description: "You have been signed in successfully.",
          });
          
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } else {
        // Registration flow
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Try logging in instead.",
              variant: "destructive",
            });
            setMode('login');
          } else {
            toast({
              title: "Registration Failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        if (data.user) {
          if (data.user.email_confirmed_at) {
            // User is automatically confirmed
            setIsSuccess(true);
            toast({
              title: "Welcome!",
              description: "Account created successfully! Signing you in...",
            });
            
            setTimeout(() => {
              onSuccess();
            }, 1000);
          } else {
            // Send verification code via our edge function
            try {
              await sendVerificationCode(trimmedEmail);
              setStep('verification');
              toast({
                title: "Verification Code Sent",
                description: "Please check your email for a 6-digit verification code.",
              });
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to send verification code. Please try again.",
                variant: "destructive",
              });
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();

      // Verify OTP code in database
      const { data: otpData, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', trimmedEmail)
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (otpError || !otpData) {
        toast({
          title: "Invalid Code",
          description: "The code you entered is invalid or has expired. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id);

      // Confirm the user's email
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        otpData.user_id || '',
        { email_confirm: true }
      );

      if (updateError) {
        // Fallback: Try to sign in the user directly
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });

        if (signInError) {
          toast({
            title: "Verification Failed",
            description: "Failed to complete verification. Please try logging in.",
            variant: "destructive",
          });
          return;
        }
      }

      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Email verified! Welcome to Syntra.",
      });
      
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && !isSuccess) {
      if (step === 'auth') {
        handleAuth(e);
      } else if (code.length === 6) {
        handleVerification();
      }
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">Success!</CardTitle>
          <p className="text-sm text-muted-foreground">
            Authentication successful. Redirecting to CodeHub...
          </p>
        </CardHeader>
      </Card>
    );
  }

  if (step === 'verification') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/a0743b79-faca-44ef-b81c-9ac71f0333fc.png" 
              alt="Syntra Logo" 
              className="h-10 w-auto" 
            />
          </div>
          <CardTitle className="text-2xl font-bold">Enter Verification Code</CardTitle>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to {email}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button 
            onClick={handleVerification} 
            className="w-full" 
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setStep('auth')}
            disabled={isLoading}
            className="w-full text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <img 
            src="/lovable-uploads/a0743b79-faca-44ef-b81c-9ac71f0333fc.png" 
            alt="Syntra Logo" 
            className="h-10 w-auto" 
          />
        </div>
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {mode === 'login' 
            ? 'Sign in to your Syntra account' 
            : 'Join Syntra and start your journey'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            variant="link"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            disabled={isLoading}
            className="text-sm p-0 h-auto"
          >
            {mode === 'login' ? 'Create one here' : 'Sign in instead'}
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
}
