import { type Request, type Response } from 'express';
import status from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { userService } from './user.service.js';
import sendResponse from '../../helpers/sendResponse.js';
import config from '../../config/index.js';
import AppError from '../../errors/AppError.js';





const createUserIntoDB = catchAsync(async (req: Request, res: Response) => {

  if (!req.body || !req.body.email || !req.body.password) {
    throw new AppError(400, 'Email and password are required');
  }

  const result = await userService.createUserIntoDB(req.body);
  res.cookie('refreshToken', result.refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User registered and logged in successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});







// getAllUsersFromDB
const getAllUsersFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'users fetched successfully',
    data: result,
  });
});

// getSingleUserFromDB
const getSingleUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await userService.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'users fetched successfully',
    data: result,
  });
});

// delete user
const deleteUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await userService.deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'user deleted successfully',
    data: result,
  });
});




export const userController = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
 };
