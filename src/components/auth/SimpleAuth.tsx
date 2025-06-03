
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SimpleAuthProps {
  onSuccess: () => void;
}

export default function SimpleAuth({ onSuccess }: SimpleAuthProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async () => {
    if (code.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 4-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use the 4-digit code as both email and password for simplicity
      const email = `user${code}@syntra.local`;
      const password = `syntra${code}`;

      // First try to sign in
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails, try to sign up
      if (error && error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        data = signUpData;
      } else if (error) {
        throw error;
      }

      if (data.user) {
        // Store the code in localStorage for persistence
        localStorage.setItem('syntra_auth_code', code);
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Enter Access Code</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your 4-digit access code to continue
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={4}
            value={code}
            onChange={(value) => setCode(value)}
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
          onClick={handleAuth} 
          className="w-full" 
          disabled={isLoading || code.length !== 4}
        >
          {isLoading ? 'Authenticating...' : 'Access Syntra'}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          New users will be automatically registered
        </p>
      </CardContent>
    </Card>
  );
}
