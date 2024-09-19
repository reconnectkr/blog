import {
  AscendingDecendingSchema,
  IntFilterSchema,
  NullableSortOrderSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
  StringNullableFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListUnitOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  typeId: AscendingDecendingSchema.optional(),
  type: z
    .object({
      id: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
      description: z
        .union([AscendingDecendingSchema, NullableSortOrderSchema])
        .optional(),
    })
    .optional(),
  description: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
});

export const ListUnitQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.number(), IntFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
        typeId: z.union([z.number(), IntFilterSchema]).optional(),
        type: z
          .object({
            id: z.union([z.number(), IntFilterSchema]).optional(),
            name: z.union([z.string(), StringFilterSchema]).optional(),
            description: z
              .union([z.string().nullable(), StringNullableFilterSchema])
              .optional(),
          })
          .optional(),
        description: z
          .union([z.string().nullable(), StringNullableFilterSchema])
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
      .union([ListUnitOrderBySchema, ListUnitOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListUnitQueryString = z.infer<typeof ListUnitQueryStringSchema>;

export const ListUnitResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        name: z.string(),
        type: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string().nullable(),
        }),
        description: z.string().nullable(),
      })
      .array(),
  })
  .strict();
export type ListUnitResponse = z.infer<typeof ListUnitResponseSchema>;
