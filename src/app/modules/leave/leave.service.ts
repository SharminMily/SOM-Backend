import { prisma } from '../../shared/prisma.js';
import AppError from '../../errors/AppError.js';
import { leaveSelectFields, type TLeaveRequestPayload, type TRejectLeavePayload } from './leave.interface.js';

const calcTotalDays = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  if (diff <= 0) throw new AppError(400, 'End date must be after start date');
  return diff;
};

// apply for leave
const applyForLeave = async (userId: string, data: TLeaveRequestPayload) => {
  const totalDays = calcTotalDays(data.startDate, data.endDate);

  return prisma.leaveRequest.create({
    data: {
      userId,
      leaveType: data.leaveType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalDays,
      reason: data.reason,
    },
    select: leaveSelectFields,
  });
};

// get all leave requests (role-scoped)
const getAllLeaveRequests = async (userId: string, role: string, query: { status?: string }) => {
  const where: any = {};

  if (query.status) where.status = query.status;

  // managers only see their direct reports
  if (role === 'MANAGER') {
    where.user = { managerId: userId };
  }

  return prisma.leaveRequest.findMany({
    where,
    select: leaveSelectFields,
    orderBy: { createdAt: 'desc' },
    
  });
};

// get single leave request
const getSingleLeaveRequest = async (id: string) => {
  return prisma.leaveRequest.findUniqueOrThrow({ where: { id }, select: leaveSelectFields });
};



const getMyLeaveRequests = async (userId: string) => {
  return prisma.leaveRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: leaveSelectFields,
  });
};

// approve leave
const approveLeave = async (id: string, approverId: string) => {
  const request = await prisma.leaveRequest.findUniqueOrThrow({ where: { id } });
  if (request.status !== 'PENDING') throw new AppError(400, 'Only pending requests can be approved');

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: { status: 'APPROVED', approvedById: approverId },
    select: leaveSelectFields,
  });

  // update leave balance
  const year = new Date(request.startDate).getFullYear();
  const balanceField = request.leaveType === 'ANNUAL' ? 'annualUsed'
    : request.leaveType === 'SICK' ? 'sickUsed'
    : request.leaveType === 'CASUAL' ? 'casualUsed'
    : null;

  if (balanceField) {
    await prisma.leaveBalance.upsert({
      where: { userId_year: { userId: request.userId, year } },
      create: { userId: request.userId, year, [balanceField]: request.totalDays },
      update: { [balanceField]: { increment: request.totalDays } },
    });
  }

  return updated;
};

// reject leave
const rejectLeave = async (id: string, approverId: string, data: TRejectLeavePayload) => {
  const request = await prisma.leaveRequest.findUniqueOrThrow({ where: { id } });
  if (request.status !== 'PENDING') throw new AppError(400, 'Only pending requests can be rejected');

  return prisma.leaveRequest.update({
    where: { id },
    data: { status: 'REJECTED', approvedById: approverId, rejectionReason: data.rejectionReason },
    select: leaveSelectFields,
  });
};

// cancel own leave
const cancelLeave = async (id: string, userId: string) => {
  const request = await prisma.leaveRequest.findUniqueOrThrow({ where: { id } });
  if (request.userId !== userId) throw new AppError(403, 'Not authorized');
  if (request.status !== 'PENDING') throw new AppError(400, 'Only pending requests can be cancelled');

  return prisma.leaveRequest.update({
    where: { id },
    data: { status: 'CANCELLED' },
    select: leaveSelectFields,
  });
};

// get own leave balance
const getMyLeaveBalance = async (userId: string) => {
  const year = new Date().getFullYear();
  return prisma.leaveBalance.upsert({
    where: { userId_year: { userId, year } },
    create: { userId, year },
    update: {},
  });
};

// get any user's leave balance
const getUserLeaveBalance = async (userId: string) => {
  const year = new Date().getFullYear();
  return prisma.leaveBalance.upsert({
    where: { userId_year: { userId, year } },
    create: { userId, year },
    update: {},
  });
};

// adjust leave balance
const adjustLeaveBalance = async (userId: string, data: object) => {
  const year = new Date().getFullYear();
  return prisma.leaveBalance.upsert({
    where: { userId_year: { userId, year } },
    create: { userId, year, ...data },
    update: data,
  });
};

export const leaveService = {
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