'use server';

import { z } from 'zod';
import {
  verifyPassword,
  createSession,
  createUser,
  deleteSession,
} from '@/lib/db/auth';
import { revalidatePath } from 'next/cache';
import { getUserByEmail } from '@/lib/db/dal';
import { signInSchema, signUpSchema } from '@/lib/schemas/auth';

const signUpServerSchema = signUpSchema.omit({ confirmPassword: true });

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
};

export async function signIn(formData: FormData): Promise<ActionResponse> {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validationResult = signInSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: z.flattenError(validationResult.error).fieldErrors,
      };
    }

    const user = await getUserByEmail(data.email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        errors: {
          email: ['Invalid email or password'],
        },
      };
    }

    const isPasswordValid = await verifyPassword(data.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
        errors: {
          password: ['Invalid email or password'],
        },
      };
    }

    await createSession(user.id);

    return {
      success: true,
      message: 'Signed in successfully',
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'An error occurred while signing in',
      error: 'Failed to sign in',
    };
  }
}

export async function signUp(formData: FormData): Promise<ActionResponse> {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validationResult = signUpServerSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: z.flattenError(validationResult.error).fieldErrors,
      };
    }

    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
        errors: {
          email: ['User with this email already exists'],
        },
      };
    }

    const user = await createUser(data.email, data.password);
    if (!user) {
      return {
        success: false,
        message: 'Failed to create user',
        error: 'Failed to create user',
      };
    }

    await createSession(user.id);

    return {
      success: true,
      message: 'Account created successfully',
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'An error occurred while creating your account',
      error: 'Failed to create account',
    };
  }
}

export async function signOut(): Promise<ActionResponse> {
  try {
    await deleteSession();
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Signed out successfully',
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      message: 'An error occurred while signing out',
      error: 'Failed to sign out',
    };
  }
}
