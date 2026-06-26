import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { notificationService } from './notification.service.js';
import sendResponse from '../../helpers/sendResponse.js';
import AppError from '../../errors/AppError.js';


// Create Notification
const createNotification = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
  throw new AppError(401, "Unauthorized");
}
    const payload = {
      ...req.body,
      userId: req.user.id, // <-- IMPORTANT
    };

    console.log(
      "Creating notification with payload:",
      payload
    );

    const result =
      await notificationService.createNotification(
        payload
      );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message:
        "Notification created successfully",
      data: result,
    });
  }
);

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


const getAllNotifications =
  catchAsync(
    async (req, res) => {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 20;

      const result =
        await notificationService.getAllNotifications(
          page,
          limit
        );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message:
          "All notifications fetched",
        data: result,
      });
    }
  );

export const notificationController = {
  createNotification,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getAllNotifications
};