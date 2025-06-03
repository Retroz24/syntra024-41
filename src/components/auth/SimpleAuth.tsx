
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Terminal, Code2, Zap } from 'lucide-react';

interface SimpleAuthProps {
  onAuthSuccess?: (user: User) => void;
  variant?: 'full' | 'compact';
}

export default function SimpleAuth({ onAuthSuccess, variant = 'full' }: SimpleAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user && onAuthSuccess) {
        onAuthSuccess(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const handleAuth = async () => {
    if (code.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 4-digit code",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);

    try {
      // Use the 4-digit code as both email and password for simplicity
      const email = `user${code}@syntra.dev`;
      const password = `syntra${code}`;

      // Try to sign in first
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails, try to sign up
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        toast({
          title: "Welcome to Syntra!",
          description: "Your account has been created successfully!",
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "You're now signed in to Syntra.",
        });
      }

      setCode('');
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCode('');
    toast({
      title: "Signed Out",
      description: "You've been signed out successfully.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user) {
    if (variant === 'compact') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Signed in</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      );
    }

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Terminal className="w-5 h-5 text-orange-500" />
            Welcome, Coder!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">You're connected to Syntra</p>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${variant === 'compact' ? 'w-auto' : 'w-full max-w-md mx-auto'}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Code2 className="w-5 h-5 text-orange-500" />
          {variant === 'compact' ? 'Quick Access' : 'Enter Syntra'}
        </CardTitle>
        {variant === 'full' && (
          <p className="text-sm text-gray-600">Enter your 4-digit access code</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={4}
            value={code}
            onChange={setCode}
            onComplete={handleAuth}
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
          disabled={code.length !== 4 || authLoading}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {authLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Connecting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Enter Syntra
            </div>
          )}
        </Button>
        
        {variant === 'full' && (
          <p className="text-xs text-gray-500 text-center">
            New to Syntra? Just enter any 4-digit code to create your account
          </p>
        )}
      </CardContent>
    </Card>
  );
}
