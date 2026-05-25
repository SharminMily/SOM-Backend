import type { TaskStatus, Priority } from '../../constants/enums.js';

export interface TCreateTaskPayload {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  assignedToId?: string;
}

export interface TUpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string;
  assignedToId?: string;
}

export interface TTaskCommentPayload {
  content: string;
}

export const taskSelectFields = {
  id: true,
  title: true,
  description: true,
  priority: true,
  status: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  projectId: true,
  assignedTo: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true } },
} as const;