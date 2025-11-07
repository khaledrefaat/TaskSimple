import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}

      <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-gray-900 dark:text-gray-50">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Sign in to sync your tasks
          </CardDescription>
        </CardHeader>
        <SignInForm />
      </Card>
    </div>
  );
}
