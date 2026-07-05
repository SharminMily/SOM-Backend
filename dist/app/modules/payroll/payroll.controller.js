"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const payroll_service_js_1 = require("./payroll.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const generatePayroll = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await payroll_service_js_1.payrollService.generatePayroll(req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Payroll generated successfully', data: result });
});
const getAllPayrolls = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await payroll_service_js_1.payrollService.getAllPayrolls(req.query);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Payrolls fetched successfully', data: result });
});
const getMyPayrolls = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await payroll_service_js_1.payrollService.getMyPayrolls(req.user?.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Payslips fetched successfully', data: result });
});
const getPayrollById = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await payroll_service_js_1.payrollService.getPayrollById(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Payroll fetched successfully', data: result });
});
const markAsPaid = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await payroll_service_js_1.payrollService.markAsPaid(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Payroll marked as paid', data: result });
});
exports.payrollController = { generatePayroll, getAllPayrolls, getMyPayrolls, getPayrollById, markAsPaid };
//# sourceMappingURL=payroll.controller.js.map