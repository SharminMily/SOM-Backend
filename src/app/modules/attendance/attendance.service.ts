import { prisma } from '../../shared/prisma.js';
import AppError from '../../errors/AppError.js';
import { attendanceSelectFields, type TOverrideAttendancePayload } from './attendance.interface.js';

// Grace period: 9:15 AM — after this, marked LATE
const GRACE_HOUR = 9;
const GRACE_MINUTE = 15;

const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const clockIn = async (userId: string, note?: string) => {
  const today = getTodayDate();

  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (existing?.clockIn) throw new AppError(400, 'Already clocked in today');

  const now = new Date();
  const isLate = now.getHours() > GRACE_HOUR || (now.getHours() === GRACE_HOUR && now.getMinutes() > GRACE_MINUTE);

  return prisma.attendance.upsert({
    where: { userId_date: { userId, date: today } },
    create: {
      userId,
      date: today,
      clockIn: now,
      status: isLate ? 'LATE' : 'PRESENT',
      note,
    },
    update: { clockIn: now, status: isLate ? 'LATE' : 'PRESENT', note },
    select: attendanceSelectFields,
  });
};

const clockOut = async (userId: string) => {
  const today = getTodayDate();

  const record = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (!record?.clockIn) throw new AppError(400, 'You have not clocked in today');
  if (record.clockOut) throw new AppError(400, 'Already clocked out today');

  return prisma.attendance.update({
    where: { userId_date: { userId, date: today } },
    data: { clockOut: new Date() },
    select: attendanceSelectFields,
  });
};

const getMyAttendance = async (userId: string, month?: number, year?: number) => {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  return prisma.attendance.findMany({
    where: { userId, date: { gte: start, lte: end } },
    select: attendanceSelectFields,
    orderBy: { date: 'desc' },
  });
};

const getUserAttendance = async (userId: string, month?: number, year?: number) => {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  return prisma.attendance.findMany({
    where: { userId, date: { gte: start, lte: end } },
    select: attendanceSelectFields,
    orderBy: { date: 'desc' },
  });
};

const getDepartmentAttendance = async (departmentId: string, month?: number, year?: number) => {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  return prisma.attendance.findMany({
    where: {
      user: { departmentId },
      date: { gte: start, lte: end },
    },
    select: attendanceSelectFields,
    orderBy: { date: 'desc' },
  });
};

const overrideAttendance = async (id: string, data: TOverrideAttendancePayload) => {
  await prisma.attendance.findUniqueOrThrow({ where: { id } });

  return prisma.attendance.update({
    where: { id },
    data,
    select: attendanceSelectFields,
  });
};

export const attendanceService = {
  clockIn,
  clockOut,
  getMyAttendance,
  getUserAttendance,
  getDepartmentAttendance,
  overrideAttendance,
};