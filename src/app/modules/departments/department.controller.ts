import type { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync.js";
import AppError from "../../errors/AppError.js";
import { departmentService } from "./department.service.js";
import sendResponse from "../../helpers/sendResponse.js";
import status from "http-status";


// create department
const createDepartmentIntoDB = catchAsync(async (req: Request, res: Response) => {
  if (!req.body || !req.body.name) {
    throw new AppError(400, 'Department name is required');
  }

  const result = await departmentService.createDepartmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Department created successfully',
    data: result,
  });
});

// get all departments
const getAllDepartmentsFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await departmentService.getAllDepartmentsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Departments fetched successfully',
    data: result,
  });
});

// get single department
const getSingleDepartmentFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await departmentService.getSingleDepartmentFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Department fetched successfully',
    data: result,
  });
});

// update department
const updateDepartmentIntoDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await departmentService.updateDepartmentIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Department updated successfully',
    data: result,
  });
});

// delete department
const deleteDepartmentFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await departmentService.deleteDepartmentFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Department deleted successfully',
    data: result,
  });
});

export const departmentController = {
  createDepartmentIntoDB,
  getAllDepartmentsFromDB,
  getSingleDepartmentFromDB,
  updateDepartmentIntoDB,
  deleteDepartmentFromDB,
};