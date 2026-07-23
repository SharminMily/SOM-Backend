import { Role } from '@prisma/client';
import type { NotificationType } from '../../constants/enums.js';

// existing TCreateNotificationPayload থাকুক (single user এর জন্য)


export const notificationSelectFields = {
  id: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
  createdAt: true,
} as const;

export type TCreateNotificationPayload = {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
};

export type TBroadcastTarget = 'ALL' | 'ROLE';

export type TCreateBroadcastNotificationPayload = {
  title: string;
  message: string;
  type: NotificationType;
  target: TBroadcastTarget;
  roles?: Role[]; 
};
// export interface TCreateNotificationPayload {
//   userId?: string;
//   title: string;
//   message: string;
//   type: NotificationType;
//   roles?: string[];
//   refId?: string;
// }

// export const notificationSelectFields = {
//   id: true,
//   title: true,
//   message: true,
//   type: true,
//   isRead: true,
//   refId: true,
//   createdAt: true,
//   userId: true,
// } as const;