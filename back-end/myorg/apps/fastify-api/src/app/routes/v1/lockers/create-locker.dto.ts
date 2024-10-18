import { z } from 'zod';
import { LockerStatus } from './commons';

export const CreateLockerRequestSchema = z
  .object({
    lockerRoomId: z.number(),
    name: z.string(),
  })
  .strict();
export type CreateLockerRequest = z.infer<typeof CreateLockerRequestSchema>;

export const CreateLockerResponseSchema = z
  .object({
    id: z.number(),
    lockerRoomId: z.number(),
    name: z.string(),
    status: z.enum(LockerStatus),
  })
  .strict();
export type CreateLockerResponse = z.infer<typeof CreateLockerResponseSchema>;
