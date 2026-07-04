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