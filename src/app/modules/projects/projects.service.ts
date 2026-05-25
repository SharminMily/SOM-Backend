import { prisma } from '../../shared/prisma.js';
import AppError from '../../errors/AppError.js';
import { projectSelectFields, type TAddMemberPayload, type TCreateProjectPayload, type TUpdateProjectPayload } from './projects.interface.js';


const createProject = async (userId: string, data: TCreateProjectPayload) => {
  return prisma.project.create({
    data: {
      ...data,
      createdById: userId,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      members: { create: { userId, role: 'LEAD' } },
    },
    select: projectSelectFields,
  });
};

const getAllProjects = async (userId: string, role: string) => {
  const where: any = {};

  // managers only see projects they created or are members of
  if (role === 'MANAGER') {
    where.OR = [{ createdById: userId }, { members: { some: { userId } } }];
  } else if (role === 'EMPLOYEE') {
    where.members = { some: { userId } };
  }

  return prisma.project.findMany({ where, select: projectSelectFields, orderBy: { createdAt: 'desc' } });
};

const getProjectById = async (id: string) => {
  return prisma.project.findUniqueOrThrow({ where: { id }, select: projectSelectFields });
};

const updateProject = async (id: string, data: TUpdateProjectPayload) => {
  await prisma.project.findUniqueOrThrow({ where: { id } });
  return prisma.project.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
    select: projectSelectFields,
  });
};

const deleteProject = async (id: string) => {
  await prisma.project.findUniqueOrThrow({ where: { id } });
  return prisma.project.delete({ where: { id } });
};

const addMember = async (projectId: string, data: TAddMemberPayload) => {
  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: data.userId } },
  });
  if (existing) throw new AppError(409, 'User is already a member of this project');

  return prisma.projectMember.create({
    data: { projectId, userId: data.userId, role: data.role ?? 'MEMBER' },
    select: { id: true, role: true, joinedAt: true, user: { select: { id: true, firstName: true, lastName: true, email: true } } },
  });
};

const removeMember = async (projectId: string, userId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) throw new AppError(404, 'Member not found in this project');

  return prisma.projectMember.delete({ where: { projectId_userId: { projectId, userId } } });
};

export const projectService = { createProject, getAllProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };