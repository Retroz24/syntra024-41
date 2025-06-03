
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SimpleAuth from '@/components/auth/SimpleAuth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';

interface AuthWrapperProps {
  children: (user: User) => React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoading, signOut } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = React.useState(!user);

  React.useEffect(() => {
    setAuthDialogOpen(!user);
  }, [user]);

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <Dialog open={authDialogOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          <SimpleAuth onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b">
        <span>Welcome, User {localStorage.getItem('syntra_auth_code')}</span>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>
      {children(user)}
    </div>
  );
}
