"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const prisma_js_1 = require("../../shared/prisma.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const notification_interface_js_1 = require("./notification.interface.js");
// create single notification (used internally by other services)
const createNotification = async (data) => {
    // console.log("userId here:", data.userId);
    return prisma_js_1.prisma.notification.create({
        data: {
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
        },
    });
};
// create many notifications at once
const createManyNotifications = async (data) => {
    return prisma_js_1.prisma.notification.createMany({ data });
};
// get own notifications with pagination
const getMyNotifications = async (userId, page = 1, limit = 20, type) => {
    const skip = (page - 1) * limit;
    const whereClause = {
        userId,
    };
    if (type) {
        whereClause.type = type;
    }
    const [notifications, total] = await Promise.all([
        prisma_js_1.prisma.notification.findMany({
            where: whereClause,
            select: notification_interface_js_1.notificationSelectFields,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma_js_1.prisma.notification.count({ where: whereClause }),
    ]);
    return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
// get unread count
const getUnreadCount = async (userId) => {
    const count = await prisma_js_1.prisma.notification.count({
        where: { userId, isRead: false },
    });
    return { count };
};
// mark single as read
const markAsRead = async (id, userId) => {
    const notification = await prisma_js_1.prisma.notification.findUniqueOrThrow({
        where: { id },
    });
    if (notification.userId !== userId) {
        throw new AppError_js_1.default(403, 'Not authorized to update this notification');
    }
    return prisma_js_1.prisma.notification.update({
        where: { id },
        data: { isRead: true },
        select: notification_interface_js_1.notificationSelectFields,
    });
};
// mark all as read
const markAllAsRead = async (userId) => {
    const result = await prisma_js_1.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
    return { updated: result.count };
};
const getAllNotifications = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
        prisma_js_1.prisma.notification.findMany({
            select: {
                id: true,
                title: true,
                message: true,
                type: true,
                isRead: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma_js_1.prisma.notification.count(),
    ]);
    return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.notificationService = {
    createNotification,
    createManyNotifications,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getAllNotifications
};
//# sourceMappingURL=notification.service.js.map