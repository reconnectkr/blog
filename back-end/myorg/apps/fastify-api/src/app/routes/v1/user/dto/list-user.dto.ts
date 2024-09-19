import {
  AscendingDecendingSchema,
  BoolFilterSchema,
  coerceBooleanSchema,
  DateTimeFilterSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListUserOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  username: AscendingDecendingSchema.optional(),
  profile: z
    .object({
      name: AscendingDecendingSchema.optional(),
      mobile: AscendingDecendingSchema.optional(),
      photo: AscendingDecendingSchema.optional(),
      departmentId: AscendingDecendingSchema.optional(),
    })
    .optional(),
  active: AscendingDecendingSchema.optional(),
  createdAt: AscendingDecendingSchema.optional(),
  updatedAt: AscendingDecendingSchema.optional(),
});

export const ListUserQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.string(), StringFilterSchema]).optional(),
        username: z.union([z.string(), StringFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
        mobile: z.union([z.string(), StringFilterSchema]).optional(),
        photo: z.union([z.string(), StringFilterSchema]).optional(),
        departmentId: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        active: z.union([coerceBooleanSchema, BoolFilterSchema]).optional(),
        createdAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        updatedAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([ListUserOrderBySchema, ListUserOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListUserQueryString = z.infer<typeof ListUserQueryStringSchema>;

export const ListUserResponseSchema = z
  .object({
    items: z
      .object({
        id: z.string(),
        username: z.string(),
        name: z.string(),
        mobile: z.string().nullable(),
        photo: z.string().url().nullable(),
        departmentId: z.number().int().nullable(),
      })
      .array(),
  })
  .strict();
export type ListUserResponse = z.infer<typeof ListUserResponseSchema>;
