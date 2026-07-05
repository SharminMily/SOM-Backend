"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveValidation = void 0;
const zod_1 = require("zod");
const applyLeaveSchema = zod_1.z.object({
    body: zod_1.z.object({
        leaveType: zod_1.z.enum(['ANNUAL', 'SICK', 'CASUAL', 'UNPAID'], { error: 'Leave type is required' }),
        startDate: zod_1.z.string({ error: 'Start date is required' }),
        endDate: zod_1.z.string({ error: 'End date is required' }),
        reason: zod_1.z.string({ error: 'Reason is required' }).min(10, 'Reason must be at least 10 characters'),
    }),
});
const rejectLeaveSchema = zod_1.z.object({
    body: zod_1.z.object({
        rejectionReason: zod_1.z.string({ error: 'Rejection reason is required' }).min(5),
    }),
});
const adjustBalanceSchema = zod_1.z.object({
    body: zod_1.z.object({
        annualTotal: zod_1.z.number().optional(),
        annualUsed: zod_1.z.number().optional(),
        sickTotal: zod_1.z.number().optional(),
        sickUsed: zod_1.z.number().optional(),
        casualTotal: zod_1.z.number().optional(),
        casualUsed: zod_1.z.number().optional(),
    }),
});
exports.leaveValidation = { applyLeaveSchema, rejectLeaveSchema, adjustBalanceSchema };
//# sourceMappingURL=leave.validation.js.map