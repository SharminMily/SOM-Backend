import { z } from 'zod';

const clockInSchema = z.object({
  body: z.object({
    note: z.string().optional(),
  }),
});

const overrideSchema = z.object({
  body: z.object({
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'], { error: 'Status is required' }),
    note: z.string().optional(),
  }),
});

export const attendanceValidation = { clockInSchema, overrideSchema };