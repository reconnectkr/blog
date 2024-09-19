import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const UpdateProductInventoryItemPathParamSchema = z.coerce
  .number()
  .int();
export type UpdateProductInventoryItemPathParam = z.infer<
  typeof UpdateProductInventoryItemPathParamSchema
>;

export const UpdateProductInventoryItemRequestSchema = z
  .object({
    productId: z.coerce.number().optional(),
    inventoryItemId: z.coerce.number().optional(),
    quantity: coerceDecimalSchema.optional(),
  })
  .strict();
export type UpdateProductInventoryItemRequest = z.infer<
  typeof UpdateProductInventoryItemRequestSchema
>;

export const UpdateProductInventoryItemResponseSchema = z
  .object({
    productId: z.number().int(),
    inventoryItem: z.object({
      id: z.number().int(),
      code: z.string(),
      name: z.string(),
      specification: z.string(),
      inventoryUnit: z.object({
        id: z.number().int(),
        name: z.string(),
      }),
      category: z
        .object({
          id: z.number().int(),
          name: z.string(),
          typeId: z.number().int(),
          parentId: z.number().int().nullable(),
        })
        .nullable(),
    }),
    quantity: coerceDecimalSchema,

    createdAt: z.coerce.date(),
    createdBy: z.string(),
    updatedAt: z.coerce.date(),
    updatedBy: z.string(),
  })
  .strict();
export type UpdateProductInventoryItemResponse = z.infer<
  typeof UpdateProductInventoryItemResponseSchema
>;
