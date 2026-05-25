import type { ProjectStatus, MemberRole } from '../../constants/enums.js';

export interface TCreateProjectPayload {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface TUpdateProjectPayload {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  progress?: number;
  startDate?: string;
  endDate?: string;
}

export interface TAddMemberPayload {
  userId: string;
  role?: MemberRole;
}

export const projectSelectFields = {
  id: true,
  title: true,
  description: true,
  status: true,
  progress: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  updatedAt: true,
  createdBy: { select: { id: true, firstName: true, lastName: true } },
  members: {
    select: {
      id: true,
      role: true,
      joinedAt: true,
      user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
    },
  },
  tasks: {
    select: { id: true, title: true, status: true, priority: true, dueDate: true },
  },
} as const;