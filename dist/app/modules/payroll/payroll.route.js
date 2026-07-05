"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollRoutes = void 0;
const express_1 = require("express");
const payroll_controller_js_1 = require("./payroll.controller.js");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const payroll_validation_js_1 = require("./payroll.validation.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = (0, express_1.Router)();
router.post('/generate', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), (0, validateRequest_js_1.default)(payroll_validation_js_1.payrollValidation.generatePayrollSchema), payroll_controller_js_1.payrollController.generatePayroll);
router.get('/', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), payroll_controller_js_1.payrollController.getAllPayrolls);
router.get('/me', authMiddleware_js_1.default, payroll_controller_js_1.payrollController.getMyPayrolls);
router.get('/:id', authMiddleware_js_1.default, payroll_controller_js_1.payrollController.getPayrollById);
router.patch('/:id/mark-paid', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), payroll_controller_js_1.payrollController.markAsPaid);
exports.payrollRoutes = router;
//# sourceMappingURL=payroll.route.js.map