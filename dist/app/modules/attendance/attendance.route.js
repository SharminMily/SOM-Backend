"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceRoutes = void 0;
const express_1 = require("express");
const attendance_controller_js_1 = require("./attendance.controller.js");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const attendance_validation_js_1 = require("./attendance.validation.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = (0, express_1.Router)();
router.post('/clock-in', authMiddleware_js_1.default, (0, requireRole_js_1.default)("EMPLOYEE", "MANAGER"), (0, validateRequest_js_1.default)(attendance_validation_js_1.attendanceValidation.clockInSchema), attendance_controller_js_1.attendanceController.clockIn);
router.patch('/clock-out', authMiddleware_js_1.default, (0, requireRole_js_1.default)("EMPLOYEE", "MANAGER"), attendance_controller_js_1.attendanceController.clockOut);
router.get('/me', authMiddleware_js_1.default, attendance_controller_js_1.attendanceController.getMyAttendance);
router.get('/user/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), attendance_controller_js_1.attendanceController.getUserAttendance);
router.get('/department/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), attendance_controller_js_1.attendanceController.getDepartmentAttendance);
router.patch('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), (0, validateRequest_js_1.default)(attendance_validation_js_1.attendanceValidation.overrideSchema), attendance_controller_js_1.attendanceController.overrideAttendance);
router.get("/stats/:departmentId", authMiddleware_js_1.default, (0, requireRole_js_1.default)("ADMIN", "MANAGER"), attendance_controller_js_1.attendanceController.getAttendanceStats);
router.get('/today', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), attendance_controller_js_1.attendanceController.getAllTodayAttendance);
exports.attendanceRoutes = router;
//# sourceMappingURL=attendance.route.js.map