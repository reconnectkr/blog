import {
  AscendingDecendingSchema,
  DateTimeFilterSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListPostOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  title: AscendingDecendingSchema.optional(),
  createdAt: AscendingDecendingSchema.optional(),
  updatedAt: AscendingDecendingSchema.optional(),
});

export const ListPostQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        title: z.union([z.string(), StringFilterSchema]).optional(),
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
      .union([ListPostOrderBySchema, ListPostOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListPostQueryString = z.infer<typeof ListPostQueryStringSchema>;

export const ListPostResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        title: z.string(),
        categories: z
          .object({
            id: z.number(),
            name: z.string(),
          })
          .array(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      })
      .array(),
  })
  .strict();
export type ListPostResponse = z.infer<typeof ListPostResponseSchema>;
