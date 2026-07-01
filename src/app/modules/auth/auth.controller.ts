import type { Request, Response } from 'express';
import status from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';

import AppError from '../../errors/AppError.js';
import { authService } from './auth.service.js';
import config from '../../config/index.js';
import sendResponse from '../../helpers/sendResponse.js';
import httpStatus from 'http-status';
// login
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  const { refreshToken } = result;

 res.cookie('auth-token', result.accessToken, {
  secure: config.node_env === 'production',
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

 res.cookie('refreshToken', result.refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Logged in user successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
});
// silent refresh
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshTokenCookie = req.cookies?.refreshToken;
  if (!refreshTokenCookie) throw new AppError(401, 'Refresh token not found');

  const result = await authService.refreshAccessToken(refreshTokenCookie);

  res.cookie('auth-token', result.accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', result.refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: { accessToken: result.accessToken, user: result.user },
  });
});

// logout
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError(401, 'Already logged out');
  }

  await authService.logoutUser(refreshToken);

  res.clearCookie('refreshToken', {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

// verify email
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw new AppError(400, 'Verification token is required');
  }

  await authService.verifyEmail(token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Email verified successfully',
    data: null,
  });
});

// forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'OTP sent to your email',
    data: null,
  });
});

// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password reset successfully',
    data: null,
  });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  await authService.changePassword(userId, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password changed successfully',
    data: null,
  });
});


// get current user
const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  
  const userId = req.user?.id as string;
  // console.log('Current user ID:', userId);

  if (!userId) {
    throw new AppError(401, 'User not authenticated');
  }

  const result = await authService.getCurrentUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Current user retrieved successfully',
    data: result,
  });
});

export const authController = {
  loginUser,
  refreshToken,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser
};