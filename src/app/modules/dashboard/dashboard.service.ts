import AppError from "../../errors/AppError.js";
import { prisma } from "../../shared/prisma.js";

const getEmployeeDashboard = async (userId: string) => {
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
  const user = await prisma.user.findUnique({
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

  const [
    todayAttendance,
    weeklyAttendance,

    totalTasks,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,

    recentTasks,

    totalProjects,
    projects,

    leaveBalance,
    recentLeaves,

    latestPayroll,

    notifications,
    unreadNotifications,

    announcements,
  ] = await Promise.all([

    // Today Attendance
    prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    // Weekly Attendance
    prisma.attendance.findMany({
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
    prisma.task.count({
      where: {
        assignedToId: userId,
      },
    }),

    prisma.task.count({
      where: {
        assignedToId: userId,
        status: "TODO",
      },
    }),

    prisma.task.count({
      where: {
        assignedToId: userId,
        status: "IN_PROGRESS",
      },
    }),

    prisma.task.count({
      where: {
        assignedToId: userId,
        status: "IN_REVIEW",
      },
    }),

    prisma.task.count({
      where: {
        assignedToId: userId,
        status: "DONE",
      },
    }),

    // Recent Tasks
    prisma.task.findMany({
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
    prisma.projectMember.count({
      where: {
        userId,
      },
    }),

    // Project List
    prisma.projectMember.findMany({
      where: {
        userId,
      },
      include: {
        project: true,
      },
      take: 5,
    }),

    // Leave Balance
    prisma.leaveBalance.findFirst({
      where: {
        userId,
        year: currentYear,
      },
    }),

    // Recent Leaves
    prisma.leaveRequest.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    // Latest Payroll
    prisma.payroll.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    // Notifications
    prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),

    // Announcements
    prisma.announcement.findMany({
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

const getManagerDashboard = async (managerId: string) => {
  const manager = await prisma.user.findUnique({
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
    throw new AppError(404, "Manager not found");
  }

  const departmentId = manager.departmentId;

  const today = new Date();

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const [
    teamMembers,
    activeProjects,
    pendingLeaveRequests,
    announcements,
    totalAttendance,
    presentToday,
    lateToday,
    absentToday,
    recentLeaves,
    recentTasks,
  ] = await Promise.all([

    prisma.user.count({
      where: {
        departmentId,
        role: "EMPLOYEE",
      },
    }),

    prisma.project.count({
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

    prisma.leaveRequest.count({
      where: {
        status: "PENDING",
        user: {
          departmentId,
        },
      },
    }),

    prisma.announcement.findMany({
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

    prisma.attendance.count({
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

    prisma.attendance.count({
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

    prisma.attendance.count({
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

    prisma.attendance.count({
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

    prisma.leaveRequest.findMany({
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

    prisma.task.findMany({
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

  const teamPerformance =
    totalAttendance === 0
      ? 0
      : Math.round(
          ((presentToday + lateToday) / totalAttendance) * 100
        );

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

  const [
    totalEmployees,
    totalDepartments,
    totalAttendanceToday,
    presentToday,
    lateToday,
    absentToday,
    pendingLeaves,

    departments,

    pendingApprovals,

    recentJoins,
    recentApprovedLeaves,
    recentCompletedProjects,
    recentPayrolls,
  ] = await Promise.all([

    // Total staff (excluding admins from the headcount card)
    prisma.user.count({
      where: {
        role: { in: ["EMPLOYEE", "MANAGER"] },
      },
    }),

    prisma.department.count(),

    prisma.attendance.count({
      where: {
        date: { gte: startOfToday, lte: endOfToday },
      },
    }),

    prisma.attendance.count({
      where: {
        status: "PRESENT",
        date: { gte: startOfToday, lte: endOfToday },
      },
    }),

    prisma.attendance.count({
      where: {
        status: "LATE",
        date: { gte: startOfToday, lte: endOfToday },
      },
    }),

    prisma.attendance.count({
      where: {
        status: "ABSENT",
        date: { gte: startOfToday, lte: endOfToday },
      },
    }),

    prisma.leaveRequest.count({
      where: { status: "PENDING" },
    }),

    // Department headcount summary
    prisma.department.findMany({
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
    prisma.leaveRequest.findMany({
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
    prisma.user.findMany({
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

    prisma.leaveRequest.findMany({
      where: { status: "APPROVED" },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),

    prisma.project.findMany({
      where: { status: "COMPLETED" },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),

    prisma.payroll.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const attendancePercentage =
    totalAttendanceToday === 0
      ? 0
      : Math.round((presentToday / totalAttendanceToday) * 100);

  // Merge heterogeneous events into one sorted activity feed
  type ActivityItem = {
    type: "user" | "leave" | "project" | "payroll";
    text: string;
    date: Date;
  };

  const activity: ActivityItem[] = [
    ...recentJoins.map((u): ActivityItem => ({
      type: "user",
      text: `New ${u.role.toLowerCase()} '${u.firstName} ${u.lastName}' joined`,
      date: u.joinedDate ?? today,
    })),

    ...recentApprovedLeaves.map((l): ActivityItem => ({
      type: "leave",
      text: `Leave request approved for ${l.user.firstName} ${l.user.lastName}`,
      date: l.updatedAt,
    })),

    ...recentCompletedProjects.map((p): ActivityItem => ({
      type: "project",
      text: `Project '${p.title}' marked as completed`,
      date: p.updatedAt,
    })),

    ...recentPayrolls.map((pr): ActivityItem => ({
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

export const dashboardService = {
  getEmployeeDashboard,
  getManagerDashboard,
  getAdminDashboard,
};