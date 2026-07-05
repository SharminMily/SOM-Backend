"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollValidation = void 0;
const zod_1 = require("zod");
const generatePayrollSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid({ message: 'Valid userId is required' }),
        month: zod_1.z.number().min(1).max(12, 'Month must be 1-12'),
        year: zod_1.z.number().min(2000).max(2100),
        baseSalary: zod_1.z.number().positive('Base salary must be positive'),
        allowances: zod_1.z.number().min(0).optional(),
        deductions: zod_1.z.number().min(0).optional(),
    }),
});
exports.payrollValidation = { generatePayrollSchema };
//# sourceMappingURL=payroll.validation.js.map