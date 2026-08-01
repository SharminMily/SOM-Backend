"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSelectFields = void 0;
// existing TCreateNotificationPayload থাকুক (single user এর জন্য)
exports.notificationSelectFields = {
    id: true,
    title: true,
    message: true,
    type: true,
    isRead: true,
    createdAt: true,
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
//# sourceMappingURL=notification.interface.js.map