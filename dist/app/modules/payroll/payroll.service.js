"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollService = void 0;
const prisma_js_1 = require("../../shared/prisma.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const payroll_interface_js_1 = require("./payroll.interface.js");
const generatePayroll = async (data) => {
    const { userId, month, year, baseSalary, allowances = 0, deductions = 0 } = data;
    await prisma_js_1.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const existing = await prisma_js_1.prisma.payroll.findUnique({ where: { userId_month_year: { userId, month, year } } });
    if (existing)
        throw new AppError_js_1.default(409, 'Payroll already generated for this month');
    const netSalary = baseSalary + allowances - deductions;
    return prisma_js_1.prisma.payroll.create({
        data: { userId, month, year, baseSalary, allowances, deductions, netSalary, status: 'GENERATED' },
        select: payroll_interface_js_1.payrollSelectFields,
    });
};
const getAllPayrolls = async (query) => {
    const where = {};
    if (query.month)
        where.month = Number(query.month);
    if (query.year)
        where.year = Number(query.year);
    if (query.status)
        where.status = query.status;
    return prisma_js_1.prisma.payroll.findMany({ where, select: payroll_interface_js_1.payrollSelectFields, orderBy: { createdAt: 'desc' } });
};
const getMyPayrolls = async (userId) => {
    return prisma_js_1.prisma.payroll.findMany({
        where: { userId },
        select: payroll_interface_js_1.payrollSelectFields,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
};
const getPayrollById = async (id) => {
    return prisma_js_1.prisma.payroll.findUniqueOrThrow({ where: { id }, select: payroll_interface_js_1.payrollSelectFields });
};
const markAsPaid = async (id) => {
    const payroll = await prisma_js_1.prisma.payroll.findUniqueOrThrow({ where: { id } });
    if (payroll.status === 'PAID')
        throw new AppError_js_1.default(400, 'Payroll already marked as paid');
    return prisma_js_1.prisma.payroll.update({
        where: { id },
        data: { status: 'PAID', paidAt: new Date() },
        select: payroll_interface_js_1.payrollSelectFields,
    });
};
exports.payrollService = { generatePayroll, getAllPayrolls, getMyPayrolls, getPayrollById, markAsPaid };
//# sourceMappingURL=payroll.service.js.map