"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSelectFields = void 0;
exports.projectSelectFields = {
    id: true,
    title: true,
    description: true,
    status: true,
    progress: true,
    startDate: true,
    endDate: true,
    createdAt: true,
    updatedAt: true,
    createdBy: { select: { id: true, firstName: true, lastName: true } },
    members: {
        select: {
            id: true,
            role: true,
            joinedAt: true,
            user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        },
    },
    tasks: {
        select: { id: true, title: true, status: true, priority: true, dueDate: true },
    },
};
//# sourceMappingURL=projects.interface.js.map