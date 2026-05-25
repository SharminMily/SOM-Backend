import { z } from 'zod';

const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string('Name is required').min(1, 'Name cannot be empty'),
    description: z.string().optional(),
    headId: z.string().uuid('Invalid headId').optional(),
  }),
});

const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    description: z.string().optional(),
    headId: z.string().uuid('Invalid headId').optional(),
  }),
});

export const departmentValidation = {
  createDepartmentSchema,
  updateDepartmentSchema,
};