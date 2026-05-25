// announcement.interface.ts
export interface TCreateAnnouncementPayload {
  title: string;
  content: string;
  isPinned?: boolean;
  isCompanyWide?: boolean;
  departmentId?: string;
}

export interface TUpdateAnnouncementPayload {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isCompanyWide?: boolean;
  departmentId?: string;
}

export const announcementSelectFields = {
  id: true,
  title: true,
  content: true,
  isPinned: true,
  isCompanyWide: true,
  createdAt: true,
  updatedAt: true,
  departmentId: true,
  createdBy: { select: { id: true, firstName: true, lastName: true, role: true } },
  department: { select: { id: true, name: true } },
} as const;