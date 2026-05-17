import { type Request, type Response } from 'express';
import status from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { userService } from './user.service.js';
import sendResponse from '../../helpers/sendResponse.js';


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


// delete user


//update user




export const userController = {
//   createUserIntoDB,
  getAllUsersFromDB,
//   getSingleUserFromDB,
//   deleteUserFromDB,
 };
