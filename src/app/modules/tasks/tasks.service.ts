import { prisma } from '../../shared/prisma.js';
import AppError from '../../errors/AppError.js';
import { taskSelectFields, type TCreateTaskPayload, type TTaskCommentPayload, type TUpdateTaskPayload } from './tasks.interface.js';


const getProjectTasks = async (projectId: string) => {
  return prisma.task.findMany({
    where: { projectId },
    select: taskSelectFields,
    orderBy: { createdAt: 'desc' },
  });
};

const createTask = async (projectId: string, userId: string, data: TCreateTaskPayload) => {
  await prisma.project.findUniqueOrThrow({ where: { id: projectId } });

  return prisma.task.create({
    data: {
      ...data,
      projectId,
      createdById: userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
    select: taskSelectFields,
  });
};

const getTaskById = async (id: string) => {
  return prisma.task.findUniqueOrThrow({ where: { id }, select: taskSelectFields });
};

const updateTask = async (id: string, data: TUpdateTaskPayload) => {
  await prisma.task.findUniqueOrThrow({ where: { id } });

  // update project progress when task status changes
  const updated = await prisma.task.update({
    where: { id },
    data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
    select: { ...taskSelectFields, projectId: true },
  });

  // recalculate project progress
  const allTasks = await prisma.task.findMany({ where: { projectId: updated.projectId } });
  const doneTasks = allTasks.filter(t => t.status === 'DONE').length;
  const progress = allTasks.length ? Math.round((doneTasks / allTasks.length) * 100) : 0;

  await prisma.project.update({ where: { id: updated.projectId }, data: { progress } });

  return updated;
};

const deleteTask = async (id: string) => {
  await prisma.task.findUniqueOrThrow({ where: { id } });
  return prisma.task.delete({ where: { id } });
};

const getTaskComments = async (taskId: string) => {
  return prisma.taskComment.findMany({
    where: { taskId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
};

const addComment = async (taskId: string, userId: string, data: TTaskCommentPayload) => {
  await prisma.task.findUniqueOrThrow({ where: { id: taskId } });

  return prisma.taskComment.create({
    data: { taskId, userId, content: data.content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
    },
  });
};

const deleteComment = async (commentId: string, userId: string, role: string) => {
  const comment = await prisma.taskComment.findUniqueOrThrow({ where: { id: commentId } });

  if (comment.userId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You can only delete your own comments');
  }

  return prisma.taskComment.delete({ where: { id: commentId } });
};


const getMyTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      assignedToId: userId,
    },
    select: taskSelectFields,
    orderBy: {
      createdAt: 'desc',
    },
  });
};


export const taskService = { getProjectTasks, createTask, getTaskById, updateTask, deleteTask, getTaskComments, addComment, deleteComment ,
  getMyTasks
  
};