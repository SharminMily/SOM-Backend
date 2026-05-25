import type { AttendanceStatus } from '../../constants/enums.js';

export interface TClockInPayload {
  note?: string;
}

export interface TOverrideAttendancePayload {
  status: AttendanceStatus;
  note?: string;
}

export const attendanceSelectFields = {
  id: true,
  date: true,
  clockIn: true,
  clockOut: true,
  status: true,
  note: true,
  createdAt: true,
  userId: true,
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
} as const;