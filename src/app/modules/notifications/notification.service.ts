import { prisma } from '../../shared/prisma.js';
import AppError from '../../errors/AppError.js';
import { notificationSelectFields, TCreateBroadcastNotificationPayload, type TCreateNotificationPayload } from './notification.interface.js';



const createBroadcastNotification = async (
  data: TCreateBroadcastNotificationPayload
) => {
  let users: { id: string }[];

  if (data.target === 'ALL') {
    users = await prisma.user.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });
  } else if (data.target === 'ROLE') {
    if (!data.roles || data.roles.length === 0) {
      throw new AppError(400, 'roles is required when target is ROLE');
    }
    users = await prisma.user.findMany({
      where: { role: { in: data.roles }, status: 'ACTIVE' },
      select: { id: true },
    });
  } else {
    throw new AppError(400, 'Invalid target');
  }

  if (users.length === 0) {
    throw new AppError(404, 'No matching users found for this target');
  }

  const notificationsData = users.map((u) => ({
    userId: u.id,
    title: data.title,
    message: data.message,
    type: data.type,
  }));

  const result = await prisma.notification.createMany({ data: notificationsData });
  return { sentTo: users.length, count: result.count };
};


// create single notification (used internally by other services)
const createNotification = async (
  data: TCreateNotificationPayload
) => {
  // console.log("userId here:", data.userId);

  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
    },
  });
};

// create many notifications at once
const createManyNotifications = async (data: TCreateNotificationPayload[]) => {
  return prisma.notification.createMany({ data });
};

// get own notifications with pagination
const getMyNotifications = async (userId: string, page = 1, limit = 20, type?: string) => {
  const skip = (page - 1) * limit;

    const whereClause: any = {
    userId,
  };

  if (type) {
    whereClause.type = type;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
       where: whereClause,
      select: notificationSelectFields,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({  where: whereClause }),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// get unread count
const getUnreadCount = async (userId: string) => {
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  });
  return { count };
};

// mark single as read
const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUniqueOrThrow({
    where: { id },
  });

  if (notification.userId !== userId) {
    throw new AppError(403, 'Not authorized to update this notification');
  }

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
    select: notificationSelectFields,
  });
};

// mark all as read
const markAllAsRead = async (userId: string) => {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  return { updated: result.count };
};



const getAllNotifications = async (
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] =
    await Promise.all([
      prisma.notification.findMany({
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.notification.count(),
    ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit
    ),
  };
};

export const notificationService = {
  createBroadcastNotification,
  createNotification,
  createManyNotifications,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getAllNotifications
};