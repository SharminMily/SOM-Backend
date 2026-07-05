"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveSelectFields = void 0;
exports.leaveSelectFields = {
    id: true,
    leaveType: true,
    startDate: true,
    endDate: true,
    totalDays: true,
    reason: true,
    status: true,
    rejectionReason: true,
    createdAt: true,
    updatedAt: true,
    user: { select: { id: true, firstName: true, lastName: true, email: true, departmentId: true } },
    approvedBy: { select: { id: true, firstName: true, lastName: true } },
};
//# sourceMappingURL=leave.interface.js.map