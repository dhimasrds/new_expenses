'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  className?: string;
  onSubmit?: (data: LoginFormData) => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export function LoginForm({
  className,
  onSubmit,
  onSignUpClick,
  onForgotPasswordClick,
  ...props
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white">Login to your account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-gray-200">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    "bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500",
                    errors.email ? 'border-red-500' : ''
                  )}
                  required
                />
                {errors.email && (
                  <FieldDescription className="text-red-400">
                    {errors.email}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-gray-200">Password</FieldLabel>
                  <button
                    type="button"
                    onClick={onForgotPasswordClick}
                    className="ml-auto inline-block text-sm text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    "bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500",
                    errors.password ? 'border-red-500' : ''
                  )}
                  required
                />
                {errors.password && (
                  <FieldDescription className="text-red-400">
                    {errors.password}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                >
                  Login with Google
                </Button>
                
                <FieldDescription className="text-center text-gray-400">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={onSignUpClick}
                    className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
                  >
                    Sign up
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}