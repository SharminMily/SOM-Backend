import { z } from 'zod';

const createTaskSchema = z.object({
  body: z.object({
    title: z.string({ error: 'Title is required' }),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().optional(),
    assignedToId: z.string().uuid().optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
    dueDate: z.string().optional(),
    assignedToId: z.string().uuid().optional(),
  }),
});

const addCommentSchema = z.object({
  body: z.object({
    content: z.string({ error: 'Comment content is required' }).min(1),
  }),
});

export const taskValidation = { createTaskSchema, updateTaskSchema, addCommentSchema };