"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const notification_controller_js_1 = require("./notification.controller.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = (0, express_1.Router)();
// GET /api/notifications/me?page=1&limit=20
router.get('/me', authMiddleware_js_1.default, notification_controller_js_1.notificationController.getMyNotifications);
router.post('/broadcast', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), notification_controller_js_1.notificationController.createBroadcastNotification);
// GET /api/notifications/me/unread-count
router.get('/me/unread-count', authMiddleware_js_1.default, notification_controller_js_1.notificationController.getUnreadCount);
router.post('/', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), notification_controller_js_1.notificationController.createNotification);
// PATCH /api/notifications/:id/read
router.patch('/:id/read', authMiddleware_js_1.default, notification_controller_js_1.notificationController.markAsRead);
// PATCH /api/notifications/me/read-all
router.patch('/me/read-all', authMiddleware_js_1.default, notification_controller_js_1.notificationController.markAllAsRead);
router.get("/", authMiddleware_js_1.default, (0, requireRole_js_1.default)("ADMIN"), notification_controller_js_1.notificationController.getAllNotifications);
exports.notificationRoutes = router;
//# sourceMappingURL=notification.route.js.map