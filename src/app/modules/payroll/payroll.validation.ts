import { z } from 'zod';

const generatePayrollSchema = z.object({
  body: z.object({
    userId: z.string().uuid({ message: 'Valid userId is required' }),
    month: z.number().min(1).max(12, 'Month must be 1-12'),
    year: z.number().min(2000).max(2100),
    baseSalary: z.number().positive('Base salary must be positive'),
    allowances: z.number().min(0).optional(),
    deductions: z.number().min(0).optional(),
  }),
});

export const payrollValidation = { generatePayrollSchema };