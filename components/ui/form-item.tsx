import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormItemProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  touched?: boolean;
  showError?: boolean;
}

export function FormItem({
  label,
  error,
  touched,
  showError,
  id,
  className,
  ...inputProps
}: FormItemProps) {
  const errorId = id ? `${id}-error` : undefined;
  const hasError = showError && touched && error;
  const shouldShowError = showError !== undefined ? showError : true;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? errorId : undefined}
        className={cn(
          'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700',
          className
        )}
        {...inputProps}
      />
      {shouldShowError && touched && error && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
