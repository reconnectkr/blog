import {
  AscendingDecendingSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

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
        status: z.enum(['unassigned', 'assigned', 'disabled']),
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

// Test data array
export const testListLockerResponse: ListLockerResponse = {
  items: [
    {
      id: 1,
      lockerRoomId: 'A101',
      name: 'Locker 1',
      status: 'unassigned',
    },
    {
      id: 2,
      lockerRoomId: 'A101',
      name: 'Locker 2',
      status: 'assigned',
      assignment: {
        assignedAt: new Date('2023-05-01T10:00:00Z'),
        userId: 1001,
        reservationId: 5001,
      },
    },
    {
      id: 3,
      lockerRoomId: 'B202',
      name: 'Locker 3',
      status: 'unassigned',
    },
    {
      id: 4,
      lockerRoomId: 'B202',
      name: 'Locker 4',
      status: 'disabled',
    },
    {
      id: 5,
      lockerRoomId: 'C303',
      name: 'Locker 5',
      status: 'assigned',
      assignment: {
        assignedAt: new Date('2023-05-02T14:30:00Z'),
        userId: 1002,
        reservationId: 5002,
      },
    },
    {
      id: 6,
      lockerRoomId: 'C303',
      name: 'Locker 6',
      status: 'unassigned',
    },
    {
      id: 7,
      lockerRoomId: 'D404',
      name: 'Locker 7',
      status: 'assigned',
      assignment: {
        assignedAt: new Date('2023-05-03T09:15:00Z'),
        userId: 1003,
        reservationId: 5003,
      },
    },
    {
      id: 8,
      lockerRoomId: 'D404',
      name: 'Locker 8',
      status: 'unassigned',
    },
    {
      id: 9,
      lockerRoomId: 'E505',
      name: 'Locker 9',
      status: 'disabled',
    },
    {
      id: 10,
      lockerRoomId: 'E505',
      name: 'Locker 10',
      status: 'unassigned',
    },
  ],
};
