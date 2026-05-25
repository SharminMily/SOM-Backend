import { z } from 'zod';

const createProjectSchema = z.object({
  body: z.object({
    title: z.string({ error: 'Title is required' }),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
    progress: z.number().min(0).max(100).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

const addMemberSchema = z.object({
  body: z.object({
    userId: z.string().uuid({ message: 'Valid userId is required' }),
    role: z.enum(['LEAD', 'MEMBER', 'VIEWER']).optional(),
  }),
});

export const projectValidation = { createProjectSchema, updateProjectSchema, addMemberSchema };