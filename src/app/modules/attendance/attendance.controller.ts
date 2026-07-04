import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';

import { attendanceService } from './attendance.service.js';
import sendResponse from '../../helpers/sendResponse.js';
import AppError from '../../errors/AppError.js';

const clockIn = catchAsync(async (req: Request, res: Response) => {
  const result = await attendanceService.clockIn(req.user?.id as string, req.body.note);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Clocked in successfully', data: result });
});

const clockOut = catchAsync(async (req: Request, res: Response) => {
  const result = await attendanceService.clockOut(req.user?.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Clocked out successfully', data: result });
});

const getMyAttendance = catchAsync(async (req: Request, res: Response) => {
  const month = req.query.month
    ? Number(req.query.month)
    : undefined;

  const year = req.query.year
    ? Number(req.query.year)
    : undefined;

  const result = await attendanceService.getMyAttendance(
    req.user?.id as string,
    month,
    year
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendance fetched successfully",
    data: result,
  });
});

const getUserAttendance = catchAsync(async (req: Request, res: Response) => {
  const { month, year } = req.query;
  const result = await attendanceService.getUserAttendance(req.params.id as string, Number(month), Number(year));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Attendance fetched successfully', data: result });
});

const getDepartmentAttendance = catchAsync(async (req: Request, res: Response) => {
  const { month, year } = req.query;
  const result = await attendanceService.getDepartmentAttendance(req.params.id as string, Number(month), Number(year));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Department attendance fetched', data: result });
});

const overrideAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await attendanceService.overrideAttendance(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Attendance updated successfully', data: result });
});



const getAttendanceStats = catchAsync(
  async (req: Request, res: Response) => {

    const departmentId = req.params.departmentId;

    if (!departmentId || Array.isArray(departmentId)) {
  throw new AppError(400, "Invalid department id");
}

const result =
  await attendanceService.getAttendanceStats(departmentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Attendance stats fetched successfully",
      data: result,
    });
  }
);


const getAllTodayAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await attendanceService.getAllTodayAttendance();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Today's attendance fetched successfully",
    data: result,
  });
});

export const attendanceController = {
   clockIn, 
   clockOut, 
   getMyAttendance, 
   getUserAttendance, 
   getDepartmentAttendance, 
   overrideAttendance,
   getAttendanceStats,
   getAllTodayAttendance   
  };