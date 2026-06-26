import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { taskService } from './tasks.service.js';
import sendResponse from '../../helpers/sendResponse.js';


const getProjectTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await taskService.getProjectTasks(req.params.projectId as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Tasks fetched successfully', data: result });
});

const createTask = catchAsync(async (req: Request, res: Response) => {
  const result = await taskService.createTask(req.params.projectId as string, req.user?.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Task created successfully', data: result });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const result = await taskService.getTaskById(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Task fetched successfully', data: result });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const result = await taskService.updateTask(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Task updated successfully', data: result });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Task deleted successfully', data: null });
});

const getTaskComments = catchAsync(async (req: Request, res: Response) => {
  const result = await taskService.getTaskComments(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Comments fetched successfully', data: result });
});

const addComment = catchAsync(async (req: Request, res: Response) => {
  const result = await taskService.addComment(req.params.id as string, req.user?.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Comment added successfully', data: result });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  await taskService.deleteComment(req.params.cid as string, req.user?.id as string, req.user?.role as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Comment deleted successfully', data: null });
});


const getMyTasks = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.id) {
  throw new Error('Unauthorized');
}
  const result = await taskService.getMyTasks(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My tasks fetched successfully',
    data: result,
  });
});


export const taskController = { getProjectTasks, createTask, getTaskById, updateTask, deleteTask, getTaskComments, addComment, deleteComment,
  getMyTasks
  };