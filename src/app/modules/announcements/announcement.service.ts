import { prisma } from '../../shared/prisma.js';
import { announcementSelectFields, type TCreateAnnouncementPayload, type TUpdateAnnouncementPayload } from './announcement.interface.js';

const createAnnouncement = async (userId: string, data: TCreateAnnouncementPayload) => {
  const announcement = await prisma.announcement.create({
    data: { ...data, createdById: userId },
    select: announcementSelectFields,
  });

  // send notifications to targeted users
  let targetUsers: { id: string }[] = [];

  if (data.isCompanyWide) {
    targetUsers = await prisma.user.findMany({ where: { status: 'ACTIVE' }, select: { id: true } });
  } else if (data.departmentId) {
    targetUsers = await prisma.user.findMany({ where: { departmentId: data.departmentId, status: 'ACTIVE' }, select: { id: true } });
  }

  if (targetUsers.length) {
    await prisma.notification.createMany({
      data: targetUsers.map(u => ({
        userId: u.id,
        title: data.title,
        message: `New announcement: ${data.title}`,
        type: 'ANNOUNCEMENT' as const,
        refId: announcement.id,
      })),
    });
  }

  return announcement;
};

const getAllAnnouncements = async (userId: string, departmentId?: string | null) => {
  return prisma.announcement.findMany({
    where: {
      OR: [
        { isCompanyWide: true },
        { departmentId: departmentId ?? undefined },
        { createdById: userId },
      ],
    },
    select: announcementSelectFields,
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
  });
};

const getAnnouncementById = async (id: string) => {
  return prisma.announcement.findUniqueOrThrow({ where: { id }, select: announcementSelectFields });
};

const updateAnnouncement = async (id: string, data: TUpdateAnnouncementPayload) => {
  await prisma.announcement.findUniqueOrThrow({ where: { id } });
  return prisma.announcement.update({ where: { id }, data, select: announcementSelectFields });
};

const deleteAnnouncement = async (id: string) => {
  await prisma.announcement.findUniqueOrThrow({ where: { id } });
  return prisma.announcement.delete({ where: { id } });
};

export const announcementService = { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement };