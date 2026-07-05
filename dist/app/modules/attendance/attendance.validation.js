"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceValidation = void 0;
const zod_1 = require("zod");
const clockInSchema = zod_1.z.object({
    body: zod_1.z.object({
        note: zod_1.z.string().optional(),
    }),
});
const overrideSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'], { error: 'Status is required' }),
        note: zod_1.z.string().optional(),
    }),
});
exports.attendanceValidation = { clockInSchema, overrideSchema };
//# sourceMappingURL=attendance.validation.js.map