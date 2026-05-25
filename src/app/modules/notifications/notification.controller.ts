import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { notificationService } from './notification.service.js';
import sendResponse from '../../helpers/sendResponse.js';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await notificationService.getMyNotifications(
    req.user?.id as string,
    page,
    limit,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched successfully',
    data: result,
  });
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationService.getUnreadCount(req.user?.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unread count fetched',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationService.markAsRead(
    req.params.id as string,
    req.user?.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationService.markAllAsRead(req.user?.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read',
    data: result,
  });
});

export const notificationController = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};