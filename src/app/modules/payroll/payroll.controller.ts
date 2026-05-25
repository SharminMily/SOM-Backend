import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { payrollService } from './payroll.service.js';
import sendResponse from '../../helpers/sendResponse.js';

const generatePayroll = catchAsync(async (req: Request, res: Response) => {
  const result = await payrollService.generatePayroll(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Payroll generated successfully', data: result });
});

const getAllPayrolls = catchAsync(async (req: Request, res: Response) => {
  const result = await payrollService.getAllPayrolls(req.query as any);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Payrolls fetched successfully', data: result });
});

const getMyPayrolls = catchAsync(async (req: Request, res: Response) => {
  const result = await payrollService.getMyPayrolls(req.user?.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Payslips fetched successfully', data: result });
});

const getPayrollById = catchAsync(async (req: Request, res: Response) => {
  const result = await payrollService.getPayrollById(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Payroll fetched successfully', data: result });
});

const markAsPaid = catchAsync(async (req: Request, res: Response) => {
  const result = await payrollService.markAsPaid(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Payroll marked as paid', data: result });
});

export const payrollController = { generatePayroll, getAllPayrolls, getMyPayrolls, getPayrollById, markAsPaid };