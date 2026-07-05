"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSelectFields = void 0;
exports.taskSelectFields = {
    id: true,
    title: true,
    description: true,
    priority: true,
    status: true,
    dueDate: true,
    createdAt: true,
    updatedAt: true,
    projectId: true,
    assignedTo: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
    createdBy: { select: { id: true, firstName: true, lastName: true } },
};
//# sourceMappingURL=tasks.interface.js.map