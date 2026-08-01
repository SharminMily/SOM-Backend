"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const notification_service_js_1 = require("./notification.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const createBroadcastNotification = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.user) {
        throw new AppError_js_1.default(401, 'Unauthorized');
    }
    const { target, roles, title, message, type } = req.body;
    if (!title || !message || !type) {
        throw new AppError_js_1.default(400, 'title, message and type are required');
    }
    const result = await notification_service_js_1.notificationService.createBroadcastNotification({
        target,
        roles: roles,
        title,
        message,
        type: type,
    });
    (0, sendResponse_js_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Notifications sent successfully',
        data: result,
    });
});
// Create Notification
const createNotification = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.user) {
        throw new AppError_js_1.default(401, "Unauthorized");
    }
    const payload = {
        ...req.body,
        userId: req.user.id,
    };
    const result = await notification_service_js_1.notificationService.createNotification(payload);
    (0, sendResponse_js_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Notification created successfully",
        data: result,
    });
});
const getMyNotifications = (0, catchAsync_js_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await notification_service_js_1.notificationService.getMyNotifications(req.user?.id, page, limit);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notifications fetched successfully',
        data: result,
    });
});
const getUnreadCount = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await notification_service_js_1.notificationService.getUnreadCount(req.user?.id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Unread count fetched',
        data: result,
    });
});
const markAsRead = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await notification_service_js_1.notificationService.markAsRead(req.params.id, req.user?.id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification marked as read',
        data: result,
    });
});
const markAllAsRead = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await notification_service_js_1.notificationService.markAllAsRead(req.user?.id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All notifications marked as read',
        data: result,
    });
});
const getAllNotifications = (0, catchAsync_js_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await notification_service_js_1.notificationService.getAllNotifications(page, limit);
    (0, sendResponse_js_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All notifications fetched",
        data: result,
    });
});
exports.notificationController = {
    createBroadcastNotification,
    createNotification,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getAllNotifications
};
//# sourceMappingURL=notification.controller.js.map