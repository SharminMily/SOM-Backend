import { prisma } from '../../shared/prisma.js';
import AppError from '../../errors/AppError.js';
import { payrollSelectFields, type TGeneratePayrollPayload } from './payroll.interface.js';

const generatePayroll = async (data: TGeneratePayrollPayload) => {
  const { userId, month, year, baseSalary, allowances = 0, deductions = 0 } = data;

  await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const existing = await prisma.payroll.findUnique({ where: { userId_month_year: { userId, month, year } } });
  if (existing) throw new AppError(409, 'Payroll already generated for this month');

  const netSalary = baseSalary + allowances - deductions;

  return prisma.payroll.create({
    data: { userId, month, year, baseSalary, allowances, deductions, netSalary, status: 'GENERATED' },
    select: payrollSelectFields,
  });
};

const getAllPayrolls = async (query: { month?: number; year?: number; status?: string }) => {
  const where: any = {};
  if (query.month) where.month = Number(query.month);
  if (query.year) where.year = Number(query.year);
  if (query.status) where.status = query.status;

  return prisma.payroll.findMany({ where, select: payrollSelectFields, orderBy: { createdAt: 'desc' } });
};

const getMyPayrolls = async (userId: string) => {
  return prisma.payroll.findMany({
    where: { userId },
    select: payrollSelectFields,
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });
};

const getPayrollById = async (id: string) => {
  return prisma.payroll.findUniqueOrThrow({ where: { id }, select: payrollSelectFields });
};

const markAsPaid = async (id: string) => {
  const payroll = await prisma.payroll.findUniqueOrThrow({ where: { id } });
  if (payroll.status === 'PAID') throw new AppError(400, 'Payroll already marked as paid');

  return prisma.payroll.update({
    where: { id },
    data: { status: 'PAID', paidAt: new Date() },
    select: payrollSelectFields,
  });
};

export const payrollService = { generatePayroll, getAllPayrolls, getMyPayrolls, getPayrollById, markAsPaid };