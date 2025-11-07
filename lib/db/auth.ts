import { compare, hash } from 'bcrypt';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import * as jose from 'jose';
import { cache } from 'react';

interface JWTPayload {
  userId: string;
  [key: string]: string | number | boolean | null | undefined;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!!'
);

const JWT_EXPIRATION = '365d';
const REFRESH_THRESHOLD = 7 * 24 * 60 * 60; // 7 days before expiration

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);

  try {
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    return { id: user?.id, email };
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function generateJWT(payload: JWTPayload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function shouldRefreshToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      clockTolerance: 15,
    });

    const exp = payload.exp as number;
    const now = Math.floor(Date.now() / 1000);

    return exp - now < REFRESH_THRESHOLD;
  } catch {
    return false;
  }
}

export async function createSession(userId: string) {
  try {
    const token = await generateJWT({ userId });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });

    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
}

export const getSession = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;
    const payload = await verifyJWT(token);

    return payload ? { userId: payload.userId, role: payload.role } : null;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('During prerendering, `cookies()` rejects')
    ) {
      console.log(
        'Cookies not available during prerendering, returning null session'
      );
      return null;
    }

    console.error('Error getting session:', error);
    return null;
  }
});

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
