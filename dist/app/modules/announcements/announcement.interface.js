"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementSelectFields = void 0;
exports.announcementSelectFields = {
    id: true,
    title: true,
    content: true,
    isPinned: true,
    isCompanyWide: true,
    createdAt: true,
    updatedAt: true,
    departmentId: true,
    createdBy: { select: { id: true, firstName: true, lastName: true, role: true } },
    department: { select: { id: true, name: true } },
};
//# sourceMappingURL=announcement.interface.js.map