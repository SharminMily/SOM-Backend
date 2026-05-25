// src/modules/user/user.validation.ts
import { z } from 'zod';
import { Role, UserStatus } from '../../constants/enums.js';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().regex(/^\+?[0-9\s-]{8,15}$/).optional(),
  departmentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  role: z.nativeEnum(Role).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  departmentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});