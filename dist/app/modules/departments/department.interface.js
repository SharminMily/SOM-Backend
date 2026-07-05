"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicDepartmentSelectFields = void 0;
exports.publicDepartmentSelectFields = {
    id: true,
    name: true,
    description: true,
    headId: true,
    createdAt: true,
    updatedAt: true,
    head: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
        },
    },
    users: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            avatarUrl: true,
        },
    },
};
//# sourceMappingURL=department.interface.js.map