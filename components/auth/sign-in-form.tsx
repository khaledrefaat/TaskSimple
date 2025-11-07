'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { FormItem } from '@/components/ui/form-item';
import { signInSchema } from '@/lib/schemas/auth';
import { signIn } from '@/app/actions/auth';
import Link from 'next/link';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const newErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'email' | 'password';
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
    setTouched({ email: true, password: true });

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = await signIn(formData);

      if (result.success) {
        router.push('/');
        router.refresh();
      } else {
        if (result.errors) {
          const newErrors: { email?: string; password?: string } = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (field === 'email' || field === 'password') {
              newErrors[field] = messages?.[0] || 'An error occurred';
            }
          });
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
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
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, password: true }));
            validate();
          }}
          error={errors.password}
          touched={touched.password}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/sign-up"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </CardContent>
  );
}
