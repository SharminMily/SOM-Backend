import type { LeaveType, LeaveStatus } from '../../constants/enums.js';

export interface TLeaveRequestPayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface TRejectLeavePayload {
  rejectionReason: string;
}

export const leaveSelectFields = {
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
} as const;