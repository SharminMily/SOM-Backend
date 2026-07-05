"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const prisma_js_1 = require("../../shared/prisma.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const tasks_interface_js_1 = require("./tasks.interface.js");
const getProjectTasks = async (projectId) => {
    return prisma_js_1.prisma.task.findMany({
        where: { projectId },
        select: tasks_interface_js_1.taskSelectFields,
        orderBy: { createdAt: 'desc' },
    });
};
const createTask = async (projectId, userId, data) => {
    await prisma_js_1.prisma.project.findUniqueOrThrow({ where: { id: projectId } });
    return prisma_js_1.prisma.task.create({
        data: {
            ...data,
            projectId,
            createdById: userId,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
        select: tasks_interface_js_1.taskSelectFields,
    });
};
const getTaskById = async (id) => {
    return prisma_js_1.prisma.task.findUniqueOrThrow({ where: { id }, select: tasks_interface_js_1.taskSelectFields });
};
const updateTask = async (id, data) => {
    await prisma_js_1.prisma.task.findUniqueOrThrow({ where: { id } });
    // update project progress when task status changes
    const updated = await prisma_js_1.prisma.task.update({
        where: { id },
        data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
        select: { ...tasks_interface_js_1.taskSelectFields, projectId: true },
    });
    // recalculate project progress
    const allTasks = await prisma_js_1.prisma.task.findMany({ where: { projectId: updated.projectId } });
    const doneTasks = allTasks.filter(t => t.status === 'DONE').length;
    const progress = allTasks.length ? Math.round((doneTasks / allTasks.length) * 100) : 0;
    await prisma_js_1.prisma.project.update({ where: { id: updated.projectId }, data: { progress } });
    return updated;
};
const deleteTask = async (id) => {
    await prisma_js_1.prisma.task.findUniqueOrThrow({ where: { id } });
    return prisma_js_1.prisma.task.delete({ where: { id } });
};
const getTaskComments = async (taskId) => {
    return prisma_js_1.prisma.taskComment.findMany({
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
const addComment = async (taskId, userId, data) => {
    await prisma_js_1.prisma.task.findUniqueOrThrow({ where: { id: taskId } });
    return prisma_js_1.prisma.taskComment.create({
        data: { taskId, userId, content: data.content },
        select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
    });
};
const deleteComment = async (commentId, userId, role) => {
    const comment = await prisma_js_1.prisma.taskComment.findUniqueOrThrow({ where: { id: commentId } });
    if (comment.userId !== userId && role !== 'ADMIN') {
        throw new AppError_js_1.default(403, 'You can only delete your own comments');
    }
    return prisma_js_1.prisma.taskComment.delete({ where: { id: commentId } });
};
const getMyTasks = async (userId) => {
    return prisma_js_1.prisma.task.findMany({
        where: {
            assignedToId: userId,
        },
        select: tasks_interface_js_1.taskSelectFields,
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.taskService = { getProjectTasks, createTask, getTaskById, updateTask, deleteTask, getTaskComments, addComment, deleteComment,
    getMyTasks
};
//# sourceMappingURL=tasks.service.js.map