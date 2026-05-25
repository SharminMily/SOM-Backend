import { z } from 'zod';

const loginSchema = z.object({
  body: z.object({
    email: z.string( 'Email is required' ).email('Invalid email'),
    password: z.string( 'Password is required' ).min(6, 'Password must be at least 6 characters'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string( 'Email is required' ).email('Invalid email'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string( 'OTP is required' ),
    newPassword: z.string( 'New password is required' ).min(6, 'Password must be at least 6 characters'),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string( 'Current password is required' ),
    newPassword: z.string( 'New password is required' ).min(6, 'Password must be at least 6 characters'),
  }),
});

export const authValidation = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};