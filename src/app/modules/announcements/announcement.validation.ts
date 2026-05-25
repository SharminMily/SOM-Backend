import { z } from 'zod';

const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string({ error: 'Title is required' }),
    content: z.string({ error: 'Content is required' }),
    isPinned: z.boolean().optional(),
    isCompanyWide: z.boolean().optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

const updateAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    isPinned: z.boolean().optional(),
    isCompanyWide: z.boolean().optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

export const announcementValidation = { createAnnouncementSchema, updateAnnouncementSchema };