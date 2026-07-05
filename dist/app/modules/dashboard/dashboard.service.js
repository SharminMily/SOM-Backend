"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const prisma_js_1 = require("../../shared/prisma.js");
const getEmployeeDashboard = async (userId) => {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    // প্রথমে user profile বের করি
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            role: true,
            status: true,
            emailVerified: true,
            joinedDate: true,
            departmentId: true,
            department: {
                select: {
                    id: true,
                    name: true,
                },
            },
            manager: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const [todayAttendance, weeklyAttendance, totalTasks, todoTasks, inProgressTasks, reviewTasks, completedTasks, recentTasks, totalProjects, projects, leaveBalance, recentLeaves, latestPayroll, notifications, unreadNotifications, announcements,] = await Promise.all([
        // Today Attendance
        prisma_js_1.prisma.attendance.findFirst({
            where: {
                userId,
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
        // Weekly Attendance
        prisma_js_1.prisma.attendance.findMany({
            where: {
                userId,
                date: {
                    gte: startOfWeek,
                },
            },
            orderBy: {
                date: "desc",
            },
            take: 7,
        }),
        // Task Counts
        prisma_js_1.prisma.task.count({
            where: {
                assignedToId: userId,
            },
        }),
        prisma_js_1.prisma.task.count({
            where: {
                assignedToId: userId,
                status: "TODO",
            },
        }),
        prisma_js_1.prisma.task.count({
            where: {
                assignedToId: userId,
                status: "IN_PROGRESS",
            },
        }),
        prisma_js_1.prisma.task.count({
            where: {
                assignedToId: userId,
                status: "IN_REVIEW",
            },
        }),
        prisma_js_1.prisma.task.count({
            where: {
                assignedToId: userId,
                status: "DONE",
            },
        }),
        // Recent Tasks
        prisma_js_1.prisma.task.findMany({
            where: {
                assignedToId: userId,
            },
            include: {
                project: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 5,
        }),
        // Total Projects
        prisma_js_1.prisma.projectMember.count({
            where: {
                userId,
            },
        }),
        // Project List
        prisma_js_1.prisma.projectMember.findMany({
            where: {
                userId,
            },
            include: {
                project: true,
            },
            take: 5,
        }),
        // Leave Balance
        prisma_js_1.prisma.leaveBalance.findFirst({
            where: {
                userId,
                year: currentYear,
            },
        }),
        // Recent Leaves
        prisma_js_1.prisma.leaveRequest.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        // Latest Payroll
        prisma_js_1.prisma.payroll.findFirst({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        // Notifications
        prisma_js_1.prisma.notification.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        prisma_js_1.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        }),
        // Announcements
        prisma_js_1.prisma.announcement.findMany({
            where: {
                OR: [
                    {
                        isCompanyWide: true,
                    },
                    {
                        departmentId: user.departmentId ?? undefined,
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
    ]);
    return {
        profile: user,
        stats: {
            totalProjects,
            totalTasks,
            todoTasks,
            inProgressTasks,
            reviewTasks,
            completedTasks,
            unreadNotifications,
        },
        attendance: {
            today: todayAttendance,
            weekly: weeklyAttendance,
        },
        tasks: {
            recent: recentTasks,
        },
        projects,
        leave: {
            balance: leaveBalance,
            recent: recentLeaves,
        },
        payroll: latestPayroll,
        notifications,
        announcements,
    };
};
const getManagerDashboard = async (managerId) => {
    const manager = await prisma_js_1.prisma.user.findUnique({
        where: {
            id: managerId,
        },
        select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            departmentId: true,
            department: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!manager) {
        throw new AppError_js_1.default(404, "Manager not found");
    }
    const departmentId = manager.departmentId;
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    const [teamMembers, activeProjects, pendingLeaveRequests, announcements, totalAttendance, presentToday, lateToday, absentToday, recentLeaves, recentTasks,] = await Promise.all([
        prisma_js_1.prisma.user.count({
            where: {
                departmentId,
                role: "EMPLOYEE",
            },
        }),
        prisma_js_1.prisma.project.count({
            where: {
                status: "ACTIVE",
                members: {
                    some: {
                        user: {
                            departmentId,
                        },
                    },
                },
            },
        }),
        prisma_js_1.prisma.leaveRequest.count({
            where: {
                status: "PENDING",
                user: {
                    departmentId,
                },
            },
        }),
        prisma_js_1.prisma.announcement.findMany({
            where: {
                OR: [
                    {
                        departmentId,
                    },
                    {
                        isCompanyWide: true,
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        prisma_js_1.prisma.attendance.count({
            where: {
                user: {
                    departmentId,
                },
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
        prisma_js_1.prisma.attendance.count({
            where: {
                user: {
                    departmentId,
                },
                status: "PRESENT",
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
        prisma_js_1.prisma.attendance.count({
            where: {
                user: {
                    departmentId,
                },
                status: "LATE",
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
        prisma_js_1.prisma.attendance.count({
            where: {
                user: {
                    departmentId,
                },
                status: "ABSENT",
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
        prisma_js_1.prisma.leaveRequest.findMany({
            where: {
                user: {
                    departmentId,
                },
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        prisma_js_1.prisma.task.findMany({
            where: {
                assignedTo: {
                    departmentId,
                },
            },
            include: {
                assignedTo: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        progress: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 5,
        }),
    ]);
    const teamPerformance = totalAttendance === 0
        ? 0
        : Math.round(((presentToday + lateToday) / totalAttendance) * 100);
    return {
        manager,
        stats: {
            teamMembers,
            activeProjects,
            pendingLeaveRequests,
            totalAttendance,
            presentToday,
            lateToday,
            absentToday,
            teamPerformance,
        },
        announcements,
        recentLeaves,
        recentTasks,
    };
};
const getAdminDashboard = async () => {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    const [totalEmployees, totalDepartments, totalAttendanceToday, presentToday, lateToday, absentToday, pendingLeaves, departments, pendingApprovals, recentJoins, recentApprovedLeaves, recentCompletedProjects, recentPayrolls,] = await Promise.all([
        // Total staff (excluding admins from the headcount card)
        prisma_js_1.prisma.user.count({
            where: {
                role: { in: ["EMPLOYEE", "MANAGER"] },
            },
        }),
        prisma_js_1.prisma.department.count(),
        prisma_js_1.prisma.attendance.count({
            where: {
                date: { gte: startOfToday, lte: endOfToday },
            },
        }),
        prisma_js_1.prisma.attendance.count({
            where: {
                status: "PRESENT",
                date: { gte: startOfToday, lte: endOfToday },
            },
        }),
        prisma_js_1.prisma.attendance.count({
            where: {
                status: "LATE",
                date: { gte: startOfToday, lte: endOfToday },
            },
        }),
        prisma_js_1.prisma.attendance.count({
            where: {
                status: "ABSENT",
                date: { gte: startOfToday, lte: endOfToday },
            },
        }),
        prisma_js_1.prisma.leaveRequest.count({
            where: { status: "PENDING" },
        }),
        // Department headcount summary
        prisma_js_1.prisma.department.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: { users: true },
                },
            },
            orderBy: { name: "asc" },
        }),
        // Pending leave requests awaiting admin action
        prisma_js_1.prisma.leaveRequest.findMany({
            where: { status: "PENDING" },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        department: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
        // Sources feeding the "Recent Activity" feed
        prisma_js_1.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                joinedDate: true,
            },
            orderBy: { joinedDate: "desc" },
            take: 3,
        }),
        prisma_js_1.prisma.leaveRequest.findMany({
            where: { status: "APPROVED" },
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
            orderBy: { updatedAt: "desc" },
            take: 3,
        }),
        prisma_js_1.prisma.project.findMany({
            where: { status: "COMPLETED" },
            orderBy: { updatedAt: "desc" },
            take: 3,
        }),
        prisma_js_1.prisma.payroll.findMany({
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 3,
        }),
    ]);
    const attendancePercentage = totalAttendanceToday === 0
        ? 0
        : Math.round((presentToday / totalAttendanceToday) * 100);
    const activity = [
        ...recentJoins.map((u) => ({
            type: "user",
            text: `New ${u.role.toLowerCase()} '${u.firstName} ${u.lastName}' joined`,
            date: u.joinedDate ?? today,
        })),
        ...recentApprovedLeaves.map((l) => ({
            type: "leave",
            text: `Leave request approved for ${l.user.firstName} ${l.user.lastName}`,
            date: l.updatedAt,
        })),
        ...recentCompletedProjects.map((p) => ({
            type: "project",
            text: `Project '${p.title}' marked as completed`,
            date: p.updatedAt,
        })),
        ...recentPayrolls.map((pr) => ({
            type: "payroll",
            text: `Salary processed for ${pr.user.firstName} ${pr.user.lastName}`,
            date: pr.createdAt,
        })),
    ]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 6);
    return {
        stats: {
            totalEmployees,
            totalDepartments,
            presentToday,
            lateToday,
            absentToday,
            totalAttendanceToday,
            attendancePercentage,
            pendingLeaves,
        },
        departments: departments.map((d) => ({
            id: d.id,
            name: d.name,
            employeeCount: d._count.users,
        })),
        pendingApprovals,
        recentActivity: activity,
    };
};
exports.dashboardService = {
    getEmployeeDashboard,
    getManagerDashboard,
    getAdminDashboard,
};
//# sourceMappingURL=dashboard.service.js.map