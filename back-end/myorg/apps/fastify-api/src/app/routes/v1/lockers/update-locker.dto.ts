import { z } from 'zod';
import { LockerStatus } from './commons';

export const UpdateLockerPathParamSchema = z.coerce.number().int();
export type UpdateLockerPathParam = z.infer<typeof UpdateLockerPathParamSchema>;

export const UpdateLockerRequestSchema = z
  .object({
    name: z.string().optional(),
  })
  .strict();
export type UpdateLockerRequest = z.infer<typeof UpdateLockerRequestSchema>;

export const UpdateLockerResponseSchema = z
  .object({
    id: z.number(),
    lockerRoomId: z.number(),
    name: z.string(),
    status: z.enum(LockerStatus),
    assignment: z
      .object({
        assignedAt: z.coerce.date(),
        userId: z.string(),
        reservationId: z.number().nullable(),
      })
      .nullable()
      .optional(),
  })
  .strict();
export type UpdateLockerResponse = z.infer<typeof UpdateLockerResponseSchema>;
