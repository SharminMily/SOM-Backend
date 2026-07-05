"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentValidation = void 0;
const zod_1 = require("zod");
const createDepartmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string('Name is required').min(1, 'Name cannot be empty'),
        description: zod_1.z.string().optional(),
        headId: zod_1.z.string().uuid('Invalid headId').optional(),
    }),
});
const updateDepartmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name cannot be empty').optional(),
        description: zod_1.z.string().optional(),
        headId: zod_1.z.string().uuid('Invalid headId').optional(),
    }),
});
exports.departmentValidation = {
    createDepartmentSchema,
    updateDepartmentSchema,
};
//# sourceMappingURL=department.validation.js.map