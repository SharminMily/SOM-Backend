"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationValidation = void 0;
const zod_1 = require("zod");
const markAsReadSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid notification id'),
    }),
});
exports.notificationValidation = { markAsReadSchema };
//# sourceMappingURL=notification.validation.js.map