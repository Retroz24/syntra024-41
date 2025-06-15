
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

interface OTPAuthProps {
  onSuccess?: () => void;
}

export default function OTPAuth({ onSuccess }: OTPAuthProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setEmailSent(true);
      toast({
        title: "Code Sent!",
        description: `A 4-digit code has been sent to ${trimmedEmail}`,
      });

      setStep('otp');
      
      // Start cooldown for resend button
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error: any) {
      console.error('OTP send error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 4-digit code",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{4}$/.test(otpCode)) {
      toast({
        title: "Invalid Code",
        description: "Code must contain only numbers",
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
        .eq('code', otpCode)
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

      // Sign in or sign up the user
      const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          shouldCreateUser: true,
        }
      });

      if (authError) {
        // If OTP sign in fails, try creating the user with a temporary password
        const tempPassword = `temp_${otpCode}_${Date.now()}`;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: tempPassword,
        });

        if (signUpError) {
          throw signUpError;
        }
      }

      toast({
        title: "Success!",
        description: "You have been successfully signed in.",
      });

      // Small delay before calling onSuccess
      setTimeout(() => {
        onSuccess?.();
      }, 500);

    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;
    setOtpCode('');
    setEmailSent(false);
    handleSendOTP();
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtpCode('');
    setEmailSent(false);
    setResendCooldown(0);
  };

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
        <CardTitle className="text-2xl">
          {step === 'email' ? 'Welcome to Syntra' : 'Enter Verification Code'}
        </CardTitle>
        <CardDescription>
          {step === 'email' 
            ? 'Enter your email to receive a 4-digit verification code'
            : emailSent 
              ? `We sent a 4-digit code to ${email}`
              : 'Please wait while we send your code...'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email.trim() || !validateEmail(email.trim())}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            {emailSent && (
              <div className="flex items-center justify-center text-green-600 mb-4">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Code sent successfully!</span>
              </div>
            )}
            
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={otpCode}
                onChange={(value) => setOtpCode(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button 
              onClick={handleVerifyOTP} 
              className="w-full" 
              disabled={isLoading || otpCode.length !== 4}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Sign In'
              )}
            </Button>
            
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isLoading}
                className="text-sm"
              >
                {resendCooldown > 0 
                  ? `Resend code in ${resendCooldown}s` 
                  : 'Resend verification code'
                }
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleBackToEmail}
                disabled={isLoading}
                className="text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change email address
              </Button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
}
