"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const leave_service_js_1 = require("./leave.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const applyForLeave = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.applyForLeave(req.user?.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Leave request submitted', data: result });
});
const getAllLeaveRequests = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.getAllLeaveRequests(req.user?.id, req.user?.role, req.query);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave requests fetched', data: result });
});
const getMyLeaveRequests = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.getMyLeaveRequests(req.user?.id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My leave requests fetched",
        data: result,
    });
});
const getSingleLeaveRequest = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.getSingleLeaveRequest(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave request fetched', data: result });
});
const approveLeave = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.approveLeave(req.params.id, req.user?.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave approved', data: result });
});
const rejectLeave = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.rejectLeave(req.params.id, req.user?.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave rejected', data: result });
});
const cancelLeave = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.cancelLeave(req.params.id, req.user?.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave cancelled', data: result });
});
const getMyLeaveBalance = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.getMyLeaveBalance(req.user?.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave balance fetched', data: result });
});
const getUserLeaveBalance = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.getUserLeaveBalance(req.params.userId);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave balance fetched', data: result });
});
const adjustLeaveBalance = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await leave_service_js_1.leaveService.adjustLeaveBalance(req.params.userId, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Leave balance adjusted', data: result });
});
exports.leaveController = {
    applyForLeave,
    getAllLeaveRequests,
    getSingleLeaveRequest,
    getMyLeaveRequests,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getMyLeaveBalance,
    getUserLeaveBalance,
    adjustLeaveBalance
};
//# sourceMappingURL=leave.controller.js.map