import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { announcementService } from './announcement.service.js';
import sendResponse from '../../helpers/sendResponse.js';

const createAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementService.createAnnouncement(req.user?.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Announcement created', data: result });
});

const getAllAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementService.getAllAnnouncements(req.user?.id as string, (req as any).user?.departmentId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Announcements fetched', data: result });
});

const getAnnouncementById = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementService.getAnnouncementById(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Announcement fetched', data: result });
});

const updateAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementService.updateAnnouncement(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Announcement updated', data: result });
});

const deleteAnnouncement = catchAsync(async (req: Request, res: Response) => {
  await announcementService.deleteAnnouncement(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Announcement deleted', data: null });
});

export const announcementController = { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement };