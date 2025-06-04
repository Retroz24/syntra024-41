
import React from 'react';
import OTPAuth from './OTPAuth';

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  return <OTPAuth onSuccess={onSuccess} />;
}
