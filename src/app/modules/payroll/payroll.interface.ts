// payroll.interface.ts
export interface TGeneratePayrollPayload {
  userId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances?: number;
  deductions?: number;
}

export const payrollSelectFields = {
  id: true,
  month: true,
  year: true,
  baseSalary: true,
  allowances: true,
  deductions: true,
  netSalary: true,
  status: true,
  paidAt: true,
  createdAt: true,
  userId: true,
  user: { select: { id: true, firstName: true, lastName: true, email: true, departmentId: true } },
} as const;