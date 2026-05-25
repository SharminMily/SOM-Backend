import { z } from 'zod';

const applyLeaveSchema = z.object({
  body: z.object({
    leaveType: z.enum(['ANNUAL', 'SICK', 'CASUAL', 'UNPAID'], { error: 'Leave type is required' }),

    startDate: z.string({ error: 'Start date is required' }),
    endDate: z.string({ error: 'End date is required' }),
    reason: z.string({ error: 'Reason is required' }).min(10, 'Reason must be at least 10 characters'),
  }),
});

const rejectLeaveSchema = z.object({
  body: z.object({
    rejectionReason: z.string({error: 'Rejection reason is required' }).min(5),
  }),
});

const adjustBalanceSchema = z.object({
  body: z.object({
    annualTotal: z.number().optional(),
    annualUsed: z.number().optional(),
    sickTotal: z.number().optional(),
    sickUsed: z.number().optional(),
    casualTotal: z.number().optional(),
    casualUsed: z.number().optional(),
  }),
});

export const leaveValidation = { applyLeaveSchema, rejectLeaveSchema, adjustBalanceSchema };