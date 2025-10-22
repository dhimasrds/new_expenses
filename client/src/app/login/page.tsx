'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  const handleForgotPasswordClick = () => {
    toast.info('Forgot password functionality coming soon!');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <Toaster />
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm
          onSubmit={handleLogin}
          onSignUpClick={handleSignUpClick}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      </div>
    </div>
  );
}