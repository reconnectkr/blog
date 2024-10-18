import { z } from 'zod';
import { LockerStatus } from './commons';

export const DisableLockerPathParamSchema = z.coerce.number().int();
export type DisableLockerPathParam = z.infer<
  typeof DisableLockerPathParamSchema
>;

export const DisableLockerRequestSchema = z.object({
  reason: z.string(),
});
export type DisableLockerRequest = z.infer<typeof DisableLockerRequestSchema>;

export const DisableLockerResponseSchema = z
  .object({
    id: z.number(),
    lockerRoomId: z.number(),
    name: z.string(),
    status: z.enum(LockerStatus),
  })
  .strict();
export type DisableLockerResponse = z.infer<typeof DisableLockerResponseSchema>;
