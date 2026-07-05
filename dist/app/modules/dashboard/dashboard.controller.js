"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const dashboard_service_js_1 = require("./dashboard.service.js");
const getEmployeeDashboard = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.user) {
        throw new AppError_js_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    const result = await dashboard_service_js_1.dashboardService.getEmployeeDashboard(req.user.id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Employee dashboard fetched successfully",
        data: result,
    });
});
const getManagerDashboard = (0, catchAsync_js_1.default)(async (req, res) => {
    const managerId = req.user?.id;
    if (!managerId) {
        throw new AppError_js_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await dashboard_service_js_1.dashboardService.getManagerDashboard(managerId);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Manager dashboard fetched successfully",
        data: result,
    });
});
const getAdminDashboard = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.user) {
        throw new AppError_js_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await dashboard_service_js_1.dashboardService.getAdminDashboard();
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin dashboard fetched successfully",
        data: result,
    });
});
exports.dashboardController = {
    getEmployeeDashboard,
    getManagerDashboard,
    getAdminDashboard,
};
//# sourceMappingURL=dashboard.controller.js.map