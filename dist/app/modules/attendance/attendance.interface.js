"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceSelectFields = void 0;
exports.attendanceSelectFields = {
    id: true,
    date: true,
    status: true,
    clockIn: true,
    clockOut: true,
    note: true,
    user: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
        },
    },
};
//# sourceMappingURL=attendance.interface.js.map