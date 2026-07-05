"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const prisma_js_1 = require("../../shared/prisma.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const projects_interface_js_1 = require("./projects.interface.js");
const createProject = async (userId, data) => {
    return prisma_js_1.prisma.project.create({
        data: {
            ...data,
            createdById: userId,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            members: { create: { userId, role: 'LEAD' } },
        },
        select: projects_interface_js_1.projectSelectFields,
    });
};
const getAllProjects = async (userId, role) => {
    const where = {};
    // managers only see projects they created or are members of
    if (role === 'MANAGER') {
        where.OR = [{ createdById: userId }, { members: { some: { userId } } }];
    }
    else if (role === 'EMPLOYEE') {
        where.members = { some: { userId } };
    }
    return prisma_js_1.prisma.project.findMany({ where, select: projects_interface_js_1.projectSelectFields, orderBy: { createdAt: 'desc' } });
};
const getProjectById = async (id) => {
    return prisma_js_1.prisma.project.findUniqueOrThrow({ where: { id }, select: projects_interface_js_1.projectSelectFields });
};
const updateProject = async (id, data) => {
    await prisma_js_1.prisma.project.findUniqueOrThrow({ where: { id } });
    return prisma_js_1.prisma.project.update({
        where: { id },
        data: {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
        },
        select: projects_interface_js_1.projectSelectFields,
    });
};
const deleteProject = async (id) => {
    await prisma_js_1.prisma.project.findUniqueOrThrow({ where: { id } });
    return prisma_js_1.prisma.project.delete({ where: { id } });
};
const addMember = async (projectId, data) => {
    const existing = await prisma_js_1.prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: data.userId } },
    });
    if (existing)
        throw new AppError_js_1.default(409, 'User is already a member of this project');
    return prisma_js_1.prisma.projectMember.create({
        data: { projectId, userId: data.userId, role: data.role ?? 'MEMBER' },
        select: { id: true, role: true, joinedAt: true, user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
};
const removeMember = async (projectId, userId) => {
    const member = await prisma_js_1.prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
    });
    if (!member)
        throw new AppError_js_1.default(404, 'Member not found in this project');
    return prisma_js_1.prisma.projectMember.delete({ where: { projectId_userId: { projectId, userId } } });
};
exports.projectService = { createProject, getAllProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };
//# sourceMappingURL=projects.service.js.map