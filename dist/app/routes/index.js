"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_js_1 = require("../modules/users/user.route.js");
const auth_route_js_1 = require("../modules/auth/auth.route.js");
const department_route_js_1 = require("../modules/departments/department.route.js");
const attendance_route_js_1 = require("../modules/attendance/attendance.route.js");
const announcement_route_js_1 = require("../modules/announcements/announcement.route.js");
const leave_route_js_1 = require("../modules/leave/leave.route.js");
const notification_route_js_1 = require("../modules/notifications/notification.route.js");
const projects_route_js_1 = require("../modules/projects/projects.route.js");
const payroll_route_js_1 = require("../modules/payroll/payroll.route.js");
const tasks_route_js_1 = require("../modules/tasks/tasks.route.js");
const dashboard_route_js_1 = require("../modules/dashboard/dashboard.route.js");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_js_1.userRoute,
    },
    {
        path: '/auth',
        route: auth_route_js_1.authRoute,
    },
    {
        path: '/department',
        route: department_route_js_1.departmentRoute,
    },
    {
        path: '/attendance',
        route: attendance_route_js_1.attendanceRoutes,
    },
    {
        path: '/announcement',
        route: announcement_route_js_1.announcementRoutes,
    },
    {
        path: '/leave',
        route: leave_route_js_1.leaveRoutes,
    },
    {
        path: '/notifications',
        route: notification_route_js_1.notificationRoutes,
    },
    {
        path: '/project',
        route: projects_route_js_1.projectRoutes,
    },
    {
        path: '/payroll',
        route: payroll_route_js_1.payrollRoutes,
    },
    {
        path: '/task',
        route: tasks_route_js_1.taskRoutes,
    },
    {
        path: '/dashboard',
        route: dashboard_route_js_1.dashboardRoute,
    },
];
moduleRoutes.forEach((item) => router.use(item.path, item.route));
exports.default = router;
//# sourceMappingURL=index.js.map