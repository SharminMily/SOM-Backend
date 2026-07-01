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

export const dashboardService = {
  getEmployeeDashboard,
};