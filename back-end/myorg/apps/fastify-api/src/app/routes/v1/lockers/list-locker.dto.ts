import {
  AscendingDecendingSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';
import { LockerStatus } from './commons';

export const ListLockerOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  lockerRoomId: AscendingDecendingSchema.optional(),
});

export const ListLockerQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
        lockerRoomId: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        lockerRoom: z
          .object({
            id: z.coerce.number(),
            name: z.string(),
          })
          .optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([ListLockerOrderBySchema, ListLockerOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListLockerQueryString = z.infer<typeof ListLockerQueryStringSchema>;

export const ListLockerResponseSchema = z
  .object({
    items: z
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
      .array(),
  })
  .strict();
export type ListLockerResponse = z.infer<typeof ListLockerResponseSchema>;
