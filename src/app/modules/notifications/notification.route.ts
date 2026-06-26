import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';

const router = Router();

// GET /api/notifications/me?page=1&limit=20
router.get('/me', authMiddleware, notificationController.getMyNotifications);

// GET /api/notifications/me/unread-count
router.get('/me/unread-count', authMiddleware, notificationController.getUnreadCount);

router.post(
  '/',
  authMiddleware,
  requireRole('ADMIN', 'MANAGER'),
  notificationController.createNotification
);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);

// PATCH /api/notifications/me/read-all
router.patch('/me/read-all', authMiddleware, notificationController.markAllAsRead);

router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  notificationController.getAllNotifications
);

export const notificationRoutes = router;