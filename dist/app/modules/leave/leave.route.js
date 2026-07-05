"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoutes = void 0;
const express_1 = require("express");
const leave_controller_js_1 = require("./leave.controller.js");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const leave_validation_js_1 = require("./leave.validation.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = (0, express_1.Router)();
router.post('/requests', authMiddleware_js_1.default, (0, validateRequest_js_1.default)(leave_validation_js_1.leaveValidation.applyLeaveSchema), leave_controller_js_1.leaveController.applyForLeave);
router.get('/requests', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), leave_controller_js_1.leaveController.getAllLeaveRequests);
router.get("/requests/me", authMiddleware_js_1.default, leave_controller_js_1.leaveController.getMyLeaveRequests);
router.get('/requests/:id', authMiddleware_js_1.default, leave_controller_js_1.leaveController.getSingleLeaveRequest);
router.patch('/requests/:id/approve', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), leave_controller_js_1.leaveController.approveLeave);
router.patch('/requests/:id/reject', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), (0, validateRequest_js_1.default)(leave_validation_js_1.leaveValidation.rejectLeaveSchema), leave_controller_js_1.leaveController.rejectLeave);
router.delete('/requests/:id', authMiddleware_js_1.default, leave_controller_js_1.leaveController.cancelLeave);
router.get('/balances/me', authMiddleware_js_1.default, leave_controller_js_1.leaveController.getMyLeaveBalance);
router.get('/balances/:userId', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), leave_controller_js_1.leaveController.getUserLeaveBalance);
router.patch('/balances/:userId', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), (0, validateRequest_js_1.default)(leave_validation_js_1.leaveValidation.adjustBalanceSchema), leave_controller_js_1.leaveController.adjustLeaveBalance);
exports.leaveRoutes = router;
//# sourceMappingURL=leave.route.js.map