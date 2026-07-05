"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementService = void 0;
const prisma_js_1 = require("../../shared/prisma.js");
const announcement_interface_js_1 = require("./announcement.interface.js");
const createAnnouncement = async (userId, data) => {
    const announcement = await prisma_js_1.prisma.announcement.create({
        data: { ...data, createdById: userId },
        select: announcement_interface_js_1.announcementSelectFields,
    });
    // send notifications to targeted users
    let targetUsers = [];
    if (data.isCompanyWide) {
        targetUsers = await prisma_js_1.prisma.user.findMany({ where: { status: 'ACTIVE' }, select: { id: true } });
    }
    else if (data.departmentId) {
        targetUsers = await prisma_js_1.prisma.user.findMany({ where: { departmentId: data.departmentId, status: 'ACTIVE' }, select: { id: true } });
    }
    if (targetUsers.length) {
        await prisma_js_1.prisma.notification.createMany({
            data: targetUsers.map(u => ({
                userId: u.id,
                title: data.title,
                message: `New announcement: ${data.title}`,
                type: 'ANNOUNCEMENT',
                refId: announcement.id,
            })),
        });
    }
    return announcement;
};
const getAllAnnouncements = async (userId, departmentId) => {
    return prisma_js_1.prisma.announcement.findMany({
        where: {
            OR: [
                { isCompanyWide: true },
                { departmentId: departmentId ?? undefined },
                { createdById: userId },
            ],
        },
        select: announcement_interface_js_1.announcementSelectFields,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
};
const getAnnouncementById = async (id) => {
    return prisma_js_1.prisma.announcement.findUniqueOrThrow({ where: { id }, select: announcement_interface_js_1.announcementSelectFields });
};
const updateAnnouncement = async (id, data) => {
    await prisma_js_1.prisma.announcement.findUniqueOrThrow({ where: { id } });
    return prisma_js_1.prisma.announcement.update({ where: { id }, data, select: announcement_interface_js_1.announcementSelectFields });
};
const deleteAnnouncement = async (id) => {
    await prisma_js_1.prisma.announcement.findUniqueOrThrow({ where: { id } });
    return prisma_js_1.prisma.announcement.delete({ where: { id } });
};
exports.announcementService = { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement };
//# sourceMappingURL=announcement.service.js.map