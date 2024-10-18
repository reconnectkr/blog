import { z } from 'zod';
import { LockerStatus } from './commons';

export const GetLockerPathParamSchema = z.coerce.number().int();
export type GetLockerPathParam = z.infer<typeof GetLockerPathParamSchema>;

export const GetLockerResponseSchema = z
  .object({
    id: z.number(),
    lockerRoomId: z.string(),
    name: z.string(),
    status: z.enum(LockerStatus),
    assignment: z
      .object({
        assignedAt: z.coerce.date(),
        userId: z.number(),
        reservationId: z.number(),
      })
      .nullable()
      .optional(),
  })
  .strict();
export type GetLockerResponse = z.infer<typeof GetLockerResponseSchema>;
