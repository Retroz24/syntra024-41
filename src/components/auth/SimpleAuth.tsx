
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface SimpleAuthProps {
  onSuccess: () => void;
}

export default function SimpleAuth({ onSuccess }: SimpleAuthProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleAuth = async () => {
    if (code.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter a complete 4-digit code",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{4}$/.test(code)) {
      toast({
        title: "Invalid Code",
        description: "Code must contain only numbers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use the 4-digit code as both email and password for simplicity
      const email = `user${code}@syntra.local`;
      const password = `syntra${code}`;

      // Clean up any existing auth state first
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Error during cleanup signout:', err);
      }

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
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (signUpError) {
          throw signUpError;
        }
        
        data = signUpData;
        
        toast({
          title: "Account Created",
          description: "New account created successfully!",
        });
      } else if (error) {
        throw error;
      } else {
        toast({
          title: "Welcome Back",
          description: "Signed in successfully!",
        });
      }

      if (data.user) {
        // Store the code in localStorage for persistence
        localStorage.setItem('syntra_auth_code', code);
        
        // Small delay before calling onSuccess
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 4 && !isLoading) {
      handleAuth();
    }
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
            onKeyDown={handleKeyPress}
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
          onClick={handleAuth} 
          className="w-full" 
          disabled={isLoading || code.length !== 4}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Authenticating...
            </>
          ) : (
            'Access Syntra'
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          New users will be automatically registered
        </p>
      </CardContent>
    </Card>
  );
}
