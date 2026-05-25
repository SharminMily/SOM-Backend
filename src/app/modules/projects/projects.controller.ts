import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync.js';
import { projectService } from './projects.service.js';
import sendResponse from '../../helpers/sendResponse.js';


const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.createProject(req.user?.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Project created successfully', data: result });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.getAllProjects(req.user?.id as string, req.user?.role as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Projects fetched successfully', data: result });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.getProjectById(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Project fetched successfully', data: result });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.updateProject(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Project updated successfully', data: result });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  await projectService.deleteProject(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Project deleted successfully', data: null });
});

const addMember = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.addMember(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Member added successfully', data: result });
});

const removeMember = catchAsync(async (req: Request, res: Response) => {
  await projectService.removeMember(req.params.id as string, req.params.userId as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Member removed successfully', data: null });
});

export const projectController = { createProject, getAllProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };