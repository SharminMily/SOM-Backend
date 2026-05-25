import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();

// GET /api/notifications/me?page=1&limit=20
router.get('/me', authMiddleware, notificationController.getMyNotifications);

// GET /api/notifications/me/unread-count
router.get('/me/unread-count', authMiddleware, notificationController.getUnreadCount);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);

// PATCH /api/notifications/me/read-all
router.patch('/me/read-all', authMiddleware, notificationController.markAsRead);


export const notificationRoutes = router;