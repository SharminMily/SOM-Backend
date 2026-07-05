"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const attendance_service_js_1 = require("./attendance.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const clockIn = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await attendance_service_js_1.attendanceService.clockIn(req.user?.id, req.body.note);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Clocked in successfully', data: result });
});
const clockOut = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await attendance_service_js_1.attendanceService.clockOut(req.user?.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Clocked out successfully', data: result });
});
const getMyAttendance = (0, catchAsync_js_1.default)(async (req, res) => {
    const month = req.query.month
        ? Number(req.query.month)
        : undefined;
    const year = req.query.year
        ? Number(req.query.year)
        : undefined;
    const result = await attendance_service_js_1.attendanceService.getMyAttendance(req.user?.id, month, year);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attendance fetched successfully",
        data: result,
    });
});
const getUserAttendance = (0, catchAsync_js_1.default)(async (req, res) => {
    const { month, year } = req.query;
    const result = await attendance_service_js_1.attendanceService.getUserAttendance(req.params.id, Number(month), Number(year));
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Attendance fetched successfully', data: result });
});
const getDepartmentAttendance = (0, catchAsync_js_1.default)(async (req, res) => {
    const { month, year } = req.query;
    const result = await attendance_service_js_1.attendanceService.getDepartmentAttendance(req.params.id, Number(month), Number(year));
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Department attendance fetched', data: result });
});
const overrideAttendance = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await attendance_service_js_1.attendanceService.overrideAttendance(req.params.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Attendance updated successfully', data: result });
});
const getAttendanceStats = (0, catchAsync_js_1.default)(async (req, res) => {
    const departmentId = req.params.departmentId;
    if (!departmentId || Array.isArray(departmentId)) {
        throw new AppError_js_1.default(400, "Invalid department id");
    }
    const result = await attendance_service_js_1.attendanceService.getAttendanceStats(departmentId);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attendance stats fetched successfully",
        data: result,
    });
});
const getAllTodayAttendance = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await attendance_service_js_1.attendanceService.getAllTodayAttendance();
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Today's attendance fetched successfully",
        data: result,
    });
});
exports.attendanceController = {
    clockIn,
    clockOut,
    getMyAttendance,
    getUserAttendance,
    getDepartmentAttendance,
    overrideAttendance,
    getAttendanceStats,
    getAllTodayAttendance
};
//# sourceMappingURL=attendance.controller.js.map