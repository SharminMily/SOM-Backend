import { z } from 'zod';

const markAsReadSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid notification id'),
  }),
});

export const notificationValidation = { markAsReadSchema };