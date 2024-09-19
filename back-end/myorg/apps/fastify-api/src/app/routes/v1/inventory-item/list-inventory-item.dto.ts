import {
  AscendingDecendingSchema,
  BoolFilterSchema,
  coerceBooleanSchema,
  DateTimeFilterSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
  StringNullableFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListInventoryItemOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  code: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  specification: AscendingDecendingSchema.optional(),
  manufacturer: AscendingDecendingSchema.optional(),
  inventoryUnit: z
    .object({
      id: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
    })
    .optional(),
  description: AscendingDecendingSchema.optional(),
  barcode: AscendingDecendingSchema.optional(),
  active: AscendingDecendingSchema.optional(),
  category: z
    .object({
      id: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
      code: AscendingDecendingSchema.optional(),
      parentId: AscendingDecendingSchema.optional(),
    })
    .optional(),
  createdAt: AscendingDecendingSchema.optional(),
  createdBy: AscendingDecendingSchema.optional(),
  updatedAt: AscendingDecendingSchema.optional(),
  updatedBy: AscendingDecendingSchema.optional(),
});

export const ListInventoryItemQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        code: z.union([z.string(), StringFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
        specification: z.union([z.string(), StringFilterSchema]).optional(),
        manufacturer: z.union([z.string(), StringFilterSchema]).optional(),
        inventoryUnit: z
          .object({
            id: z.coerce.number(),
            name: z.string(),
          })
          .optional(),
        description: z
          .union([z.string(), StringNullableFilterSchema])
          .optional(),
        barcode: z.union([z.string(), StringNullableFilterSchema]).optional(),
        active: z.union([coerceBooleanSchema, BoolFilterSchema]).optional(),
        category: z
          .object({
            id: z.coerce.number(),
            name: z.string(),
            code: z.string(),
            parentId: z.coerce.number(),
          })
          .nullable()
          .optional(),
        createdAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        createdBy: z.union([z.string(), StringFilterSchema]).optional(),
        updatedAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        updatedBy: z.union([z.string(), StringFilterSchema]).optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([
        ListInventoryItemOrderBySchema,
        ListInventoryItemOrderBySchema.array(),
      ])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListInventoryItemQueryString = z.infer<
  typeof ListInventoryItemQueryStringSchema
>;

export const ListInventoryItemResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
        specification: z.string(),
        manufacturer: z.string(),
        inventoryUnit: z.object({
          id: z.number(),
          name: z.string(),
        }),
        description: z.string().nullable(),
        barcode: z.string().nullable(),
        active: z.boolean(),
        category: z
          .object({
            id: z.number(),
            name: z.string(),
          })
          .nullable(),
        createdAt: z.coerce.date(),
        createdBy: z.string(),
        updatedAt: z.coerce.date(),
        updatedBy: z.string(),
      })
      .array(),
  })
  .strict();
export type ListInventoryItemResponse = z.infer<
  typeof ListInventoryItemResponseSchema
>;
