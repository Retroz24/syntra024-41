
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AuthForm from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: (user: User) => React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoading, signOut } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);

  useEffect(() => {
    // Close dialog if user is logged in
    if (user) {
      setAuthDialogOpen(false);
    } else {
      setAuthDialogOpen(true);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Dialog open={authDialogOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          <AuthForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b">
        <span>Welcome, {user.email}</span>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>
      {children(user)}
    </div>
  );
}
