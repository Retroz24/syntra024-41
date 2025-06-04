
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

interface OTPAuthProps {
  onSuccess?: () => void;
}

export default function OTPAuth({ onSuccess }: OTPAuthProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      toast({
        title: "OTP Sent!",
        description: `A 4-digit code has been sent to ${email}`,
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
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP code",
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
        description: "Please enter a 4-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP code in database
      const { data: otpData, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', otpCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (otpError || !otpData) {
        toast({
          title: "Invalid Code",
          description: "The code you entered is invalid or has expired",
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
        email,
        options: {
          shouldCreateUser: true,
        }
      });

      if (authError) {
        // If OTP sign in fails, try creating the user with a temporary password
        const tempPassword = `temp_${otpCode}_${Date.now()}`;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
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

      onSuccess?.();

    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to verify OTP code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;
    setOtpCode('');
    handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtpCode('');
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
            : `We sent a 4-digit code to ${email}`
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
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !email}>
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
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={otpCode}
                onChange={(value) => setOtpCode(value)}
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
                disabled={resendCooldown > 0}
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
