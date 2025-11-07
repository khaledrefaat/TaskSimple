'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { FormItem } from '@/components/ui/form-item';
import { signUpSchema } from '@/lib/schemas/auth';
import { signUp } from '@/app/actions/auth';
import Link from 'next/link';

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const result = signUpSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      const newErrors: {
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'email' | 'password' | 'confirmPassword';
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = await signUp(formData);

      if (result.success) {
        router.push('/');
        router.refresh();
      } else {
        if (result.errors) {
          const newErrors: {
            email?: string;
            password?: string;
            confirmPassword?: string;
          } = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (
              field === 'email' ||
              field === 'password' ||
              field === 'confirmPassword'
            ) {
              newErrors[field] = messages?.[0] || 'An error occurred';
            }
          });
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors({
        email: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormItem
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, email: true }));
            validate();
          }}
          error={errors.email}
          touched={touched.email}
        />
        <FormItem
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
            if (touched.confirmPassword && confirmPassword) {
              validate();
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, password: true }));
            validate();
          }}
          error={errors.password}
          touched={touched.password}
        />
        <FormItem
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, confirmPassword: true }));
            validate();
          }}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/sign-in"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </CardContent>
  );
}
