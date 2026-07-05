"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveService = void 0;
const prisma_js_1 = require("../../shared/prisma.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const leave_interface_js_1 = require("./leave.interface.js");
const calcTotalDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff <= 0)
        throw new AppError_js_1.default(400, 'End date must be after start date');
    return diff;
};
// apply for leave
const applyForLeave = async (userId, data) => {
    const totalDays = calcTotalDays(data.startDate, data.endDate);
    return prisma_js_1.prisma.leaveRequest.create({
        data: {
            userId,
            leaveType: data.leaveType,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            totalDays,
            reason: data.reason,
        },
        select: leave_interface_js_1.leaveSelectFields,
    });
};
// get all leave requests (role-scoped)
const getAllLeaveRequests = async (userId, role, query) => {
    const where = {};
    if (query.status)
        where.status = query.status;
    // managers only see their direct reports
    if (role === 'MANAGER') {
        where.user = { managerId: userId };
    }
    return prisma_js_1.prisma.leaveRequest.findMany({
        where,
        select: leave_interface_js_1.leaveSelectFields,
        orderBy: { createdAt: 'desc' },
    });
};
// get single leave request
const getSingleLeaveRequest = async (id) => {
    return prisma_js_1.prisma.leaveRequest.findUniqueOrThrow({ where: { id }, select: leave_interface_js_1.leaveSelectFields });
};
const getMyLeaveRequests = async (userId) => {
    return prisma_js_1.prisma.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: leave_interface_js_1.leaveSelectFields,
    });
};
// approve leave
const approveLeave = async (id, approverId) => {
    const request = await prisma_js_1.prisma.leaveRequest.findUniqueOrThrow({ where: { id } });
    if (request.status !== 'PENDING')
        throw new AppError_js_1.default(400, 'Only pending requests can be approved');
    const updated = await prisma_js_1.prisma.leaveRequest.update({
        where: { id },
        data: { status: 'APPROVED', approvedById: approverId },
        select: leave_interface_js_1.leaveSelectFields,
    });
    // update leave balance
    const year = new Date(request.startDate).getFullYear();
    const balanceField = request.leaveType === 'ANNUAL' ? 'annualUsed'
        : request.leaveType === 'SICK' ? 'sickUsed'
            : request.leaveType === 'CASUAL' ? 'casualUsed'
                : null;
    if (balanceField) {
        await prisma_js_1.prisma.leaveBalance.upsert({
            where: { userId_year: { userId: request.userId, year } },
            create: { userId: request.userId, year, [balanceField]: request.totalDays },
            update: { [balanceField]: { increment: request.totalDays } },
        });
    }
    return updated;
};
// reject leave
const rejectLeave = async (id, approverId, data) => {
    const request = await prisma_js_1.prisma.leaveRequest.findUniqueOrThrow({ where: { id } });
    if (request.status !== 'PENDING')
        throw new AppError_js_1.default(400, 'Only pending requests can be rejected');
    return prisma_js_1.prisma.leaveRequest.update({
        where: { id },
        data: { status: 'REJECTED', approvedById: approverId, rejectionReason: data.rejectionReason },
        select: leave_interface_js_1.leaveSelectFields,
    });
};
// cancel own leave
const cancelLeave = async (id, userId) => {
    const request = await prisma_js_1.prisma.leaveRequest.findUniqueOrThrow({ where: { id } });
    if (request.userId !== userId)
        throw new AppError_js_1.default(403, 'Not authorized');
    if (request.status !== 'PENDING')
        throw new AppError_js_1.default(400, 'Only pending requests can be cancelled');
    return prisma_js_1.prisma.leaveRequest.update({
        where: { id },
        data: { status: 'CANCELLED' },
        select: leave_interface_js_1.leaveSelectFields,
    });
};
// get own leave balance
const getMyLeaveBalance = async (userId) => {
    const year = new Date().getFullYear();
    return prisma_js_1.prisma.leaveBalance.upsert({
        where: { userId_year: { userId, year } },
        create: { userId, year },
        update: {},
    });
};
// get any user's leave balance
const getUserLeaveBalance = async (userId) => {
    const year = new Date().getFullYear();
    return prisma_js_1.prisma.leaveBalance.upsert({
        where: { userId_year: { userId, year } },
        create: { userId, year },
        update: {},
    });
};
// adjust leave balance
const adjustLeaveBalance = async (userId, data) => {
    const year = new Date().getFullYear();
    return prisma_js_1.prisma.leaveBalance.upsert({
        where: { userId_year: { userId, year } },
        create: { userId, year, ...data },
        update: data,
    });
};
exports.leaveService = {
    applyForLeave,
    getAllLeaveRequests,
    getSingleLeaveRequest,
    getMyLeaveRequests,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getMyLeaveBalance,
    getUserLeaveBalance,
    adjustLeaveBalance,
};
//# sourceMappingURL=leave.service.js.map