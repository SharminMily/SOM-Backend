"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceService = void 0;
const prisma_js_1 = require("../../shared/prisma.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const attendance_interface_js_1 = require("./attendance.interface.js");
// Grace period: 9:15 AM — after this, marked LATE
const GRACE_HOUR = 8;
const GRACE_MINUTE = 15;
const getTodayDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
const clockIn = async (userId, note) => {
    const today = getTodayDate();
    const existing = await prisma_js_1.prisma.attendance.findUnique({
        where: { userId_date: { userId, date: today } },
    });
    if (existing?.clockIn)
        throw new AppError_js_1.default(400, 'Already clocked in today');
    const now = new Date();
    const isLate = now.getHours() > GRACE_HOUR || (now.getHours() === GRACE_HOUR && now.getMinutes() > GRACE_MINUTE);
    return prisma_js_1.prisma.attendance.upsert({
        where: { userId_date: { userId, date: today } },
        create: {
            userId,
            date: today,
            clockIn: now,
            status: isLate ? 'LATE' : 'PRESENT',
            note,
        },
        update: { clockIn: now, status: isLate ? 'LATE' : 'PRESENT', note },
        select: attendance_interface_js_1.attendanceSelectFields,
    });
};
const clockOut = async (userId) => {
    const today = getTodayDate();
    const record = await prisma_js_1.prisma.attendance.findUnique({
        where: { userId_date: { userId, date: today } },
    });
    if (!record?.clockIn)
        throw new AppError_js_1.default(400, 'You have not clocked in today');
    if (record.clockOut)
        throw new AppError_js_1.default(400, 'Already clocked out today');
    return prisma_js_1.prisma.attendance.update({
        where: { userId_date: { userId, date: today } },
        data: { clockOut: new Date() },
        select: attendance_interface_js_1.attendanceSelectFields,
    });
};
const getMyAttendance = async (userId, month, year) => {
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    const y = year ?? now.getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);
    return prisma_js_1.prisma.attendance.findMany({
        where: { userId, date: { gte: start, lte: end } },
        select: attendance_interface_js_1.attendanceSelectFields,
        orderBy: { date: 'desc' },
    });
};
const getUserAttendance = async (userId, month, year) => {
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    const y = year ?? now.getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);
    return prisma_js_1.prisma.attendance.findMany({
        where: { userId, date: { gte: start, lte: end } },
        select: attendance_interface_js_1.attendanceSelectFields,
        orderBy: { date: 'desc' },
    });
};
const getDepartmentAttendance = async (departmentId, month, year) => {
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    const y = year ?? now.getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);
    return prisma_js_1.prisma.attendance.findMany({
        where: {
            user: { departmentId },
            date: { gte: start, lte: end },
        },
        select: attendance_interface_js_1.attendanceSelectFields,
        orderBy: { date: 'desc' },
    });
};
const overrideAttendance = async (id, data) => {
    await prisma_js_1.prisma.attendance.findUniqueOrThrow({ where: { id } });
    return prisma_js_1.prisma.attendance.update({
        where: { id },
        data,
        select: attendance_interface_js_1.attendanceSelectFields,
    });
};
const getAttendanceStats = async (departmentId) => {
    const today = getTodayDate();
    const records = await prisma_js_1.prisma.attendance.findMany({
        where: {
            user: {
                departmentId,
            },
            date: today,
        },
    });
    return {
        total: records.length,
        present: records.filter((r) => r.status === "PRESENT").length,
        late: records.filter((r) => r.status === "LATE").length,
        absent: records.filter((r) => r.status === "ABSENT").length,
    };
};
const getAllTodayAttendance = async () => {
    const today = getTodayDate();
    // Shob active employee ana — department filter chara
    const employees = await prisma_js_1.prisma.user.findMany({
        where: { status: 'ACTIVE' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
        },
    });
    // Aajker shob existing attendance record
    const todayRecords = await prisma_js_1.prisma.attendance.findMany({
        where: { date: today },
        select: attendance_interface_js_1.attendanceSelectFields,
    });
    const recordMap = new Map(todayRecords.map((r) => [r.user.id, r]));
    const merged = employees.map((emp) => {
        const record = recordMap.get(emp.id);
        if (record)
            return record;
        return {
            id: `absent-${emp.id}`,
            status: 'ABSENT',
            date: today,
            clockIn: null,
            clockOut: null,
            note: null,
            user: emp,
        };
    });
    return merged;
};
exports.attendanceService = {
    clockIn,
    clockOut,
    getMyAttendance,
    getUserAttendance,
    getDepartmentAttendance,
    overrideAttendance,
    getAttendanceStats,
    getAllTodayAttendance
};
//# sourceMappingURL=attendance.service.js.map