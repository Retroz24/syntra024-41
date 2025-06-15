
import React from 'react';
import SimpleAuth from './SimpleAuth';

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  return <SimpleAuth onSuccess={onSuccess} />;
}
