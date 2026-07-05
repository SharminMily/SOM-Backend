"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementValidation = void 0;
const zod_1 = require("zod");
const createAnnouncementSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ error: 'Title is required' }),
        content: zod_1.z.string({ error: 'Content is required' }),
        isPinned: zod_1.z.boolean().optional(),
        isCompanyWide: zod_1.z.boolean().optional(),
        departmentId: zod_1.z.string().uuid().optional(),
    }),
});
const updateAnnouncementSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        content: zod_1.z.string().optional(),
        isPinned: zod_1.z.boolean().optional(),
        isCompanyWide: zod_1.z.boolean().optional(),
        departmentId: zod_1.z.string().uuid().optional(),
    }),
});
exports.announcementValidation = { createAnnouncementSchema, updateAnnouncementSchema };
//# sourceMappingURL=announcement.validation.js.map