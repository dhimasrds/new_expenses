'use client';

import { useRouter } from 'next/navigation';
import { SignUpForm } from '@/components/SignUpForm';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      await signup(data.name, data.email, data.password);
      toast.success('Account created successfully! Please login.');
      router.push('/login');
    } catch (error) {
      console.error('Sign up failed:', error);
      toast.error('Sign up failed. Please try again.');
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <Toaster />
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <SignUpForm
          onSubmit={handleSignUp}
          onLoginClick={handleLoginClick}
        />
      </div>
    </div>
  );
}