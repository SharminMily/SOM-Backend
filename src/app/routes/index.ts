import { Router } from "express";
import { userRoute } from "../modules/users/user.route.js";
import { authRoute } from "../modules/auth/auth.route.js";
import { departmentRoute } from "../modules/departments/department.route.js";
import { attendanceRoutes } from "../modules/attendance/attendance.route.js";
import { announcementRoutes } from "../modules/announcements/announcement.route.js";
import { leaveRoutes } from "../modules/leave/leave.route.js";
import { notificationRoutes } from "../modules/notifications/notification.route.js";
import { projectRoutes } from "../modules/projects/projects.route.js";
import { payrollRoutes } from "../modules/payroll/payroll.route.js";
import { taskRoutes } from "../modules/tasks/tasks.route.js";


const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  
  {
     path: '/department',
     route: departmentRoute,
  },
  {
     path: '/attendance',
     route: attendanceRoutes,
  },
  {
     path: '/announcement',
     route: announcementRoutes,
  },
  {
     path: '/leave',
     route: leaveRoutes,
  },
  {
     path: '/notifications',
     route: notificationRoutes,
  },
  {
     path: '/project',
     route: projectRoutes,
  },
  {
     path: '/payroll',
     route: payrollRoutes,
  },
  {
     path: '/tasks',
     route: taskRoutes,
  },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;
