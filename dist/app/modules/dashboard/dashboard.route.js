"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoute = void 0;
const express_1 = require("express");
const dashboard_controller_js_1 = require("./dashboard.controller.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = (0, express_1.Router)();
router.get("/admin", authMiddleware_js_1.default, (0, requireRole_js_1.default)("ADMIN"), dashboard_controller_js_1.dashboardController.getAdminDashboard);
router.get("/manager", authMiddleware_js_1.default, (0, requireRole_js_1.default)("MANAGER"), dashboard_controller_js_1.dashboardController.getManagerDashboard);
router.get('/employee', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER', 'EMPLOYEE'), dashboard_controller_js_1.dashboardController.getEmployeeDashboard);
exports.dashboardRoute = router;
//# sourceMappingURL=dashboard.route.js.map