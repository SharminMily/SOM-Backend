import type { NotificationType } from '../../constants/enums.js';

export interface TCreateNotificationPayload {
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  refId?: string;
}

export const notificationSelectFields = {
  id: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
  refId: true,
  createdAt: true,
  userId: true,
} as const;