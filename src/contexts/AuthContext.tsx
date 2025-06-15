
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any | null }>;
  sendOTP: (email: string) => Promise<{ error: any | null }>;
  verifyOTP: (email: string, code: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Enhanced auth state cleanup
  const cleanupAuthState = () => {
    try {
      // Clear all auth-related localStorage keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem('syntra_auth_code');
      
      // Clear session storage as well
      if (typeof sessionStorage !== 'undefined') {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.warn('Error cleaning up auth state:', error);
    }
  };

  // Fetch user profile with error handling
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Profile fetch failed:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (!mounted) return;

          console.log('Auth state changed:', event, currentSession?.user?.email);
          
          // Update session and user immediately
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user && event === 'SIGNED_IN') {
            // Fetch profile in background without blocking
            setTimeout(async () => {
              if (mounted) {
                try {
                  const profileData = await fetchProfile(currentSession.user.id);
                  if (mounted) {
                    setProfile(profileData);
                  }
                } catch (error) {
                  console.error('Error loading profile after sign in:', error);
                }
              }
            }, 100);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            cleanupAuthState();
          }

          if (mounted) {
            setIsLoading(false);
          }
        });

        // Get initial session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          cleanupAuthState();
        }
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            const profileData = await fetchProfile(currentSession.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
          
          setIsLoading(false);
          setIsInitialized(true);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Clean up any existing state
      cleanupAuthState();
      
      // Sign out globally first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Error during global sign out:', err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign In Failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
        return { error };
      }
      
      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Clean up any existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign Up Failed",
          description: error.message || "Please try again with different credentials.",
          variant: "destructive",
        });
        return { error };
      }
      
      if (data.user) {
        toast({
          title: "Account Created!",
          description: "Please check your email to confirm your account.",
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (email: string) => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }

      return { error: null };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { error };
    }
  };

  const verifyOTP = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      
      // Verify OTP code in database
      const { data: otpData, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (otpError || !otpData) {
        return { error: new Error('Invalid or expired OTP code') };
      }

      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id);

      // Create or sign in user
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) {
        // Fallback: create user with temporary password
        const tempPassword = `temp_${code}_${Date.now()}`;
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: tempPassword,
        });

        if (signUpError) {
          return { error: signUpError };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clean up state first
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Reset local state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
      });
      
      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: new Error('User not authenticated') };
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (!error && profile) {
        setProfile({ ...profile, ...updates });
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      isLoading, 
      signIn, 
      signUp, 
      signOut,
      updateProfile,
      sendOTP,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
