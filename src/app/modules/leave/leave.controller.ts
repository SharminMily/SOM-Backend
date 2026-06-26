import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { leaveService } from './leave.service.js';
import sendResponse from '../../helpers/sendResponse.js';

const applyForLeave = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.applyForLeave(req.user?.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Leave request submitted', data: result });
});

const getAllLeaveRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.getAllLeaveRequests(req.user?.id as string, req.user?.role as string, req.query as any);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave requests fetched', data: result });
});

const getMyLeaveRequests = catchAsync(async (req, res) => {
  const result = await leaveService.getMyLeaveRequests(
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My leave requests fetched",
    data: result,
  });
});


const getSingleLeaveRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.getSingleLeaveRequest(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave request fetched', data: result });
});

const approveLeave = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.approveLeave(req.params.id as string, req.user?.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave approved', data: result });
});

const rejectLeave = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.rejectLeave(req.params.id as string, req.user?.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave rejected', data: result });
});

const cancelLeave = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.cancelLeave(req.params.id as string, req.user?.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave cancelled', data: result });
});

const getMyLeaveBalance = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.getMyLeaveBalance(req.user?.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave balance fetched', data: result });
});

const getUserLeaveBalance = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.getUserLeaveBalance(req.params.userId as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave balance fetched', data: result });
});

const adjustLeaveBalance = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveService.adjustLeaveBalance(req.params.userId as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Leave balance adjusted', data: result });
});

export const leaveController = { 
  applyForLeave,
  getAllLeaveRequests, 
  getSingleLeaveRequest, 
  getMyLeaveRequests,
  approveLeave, 
  rejectLeave, 
  cancelLeave, 
  getMyLeaveBalance, 
  getUserLeaveBalance, 
  adjustLeaveBalance 
};