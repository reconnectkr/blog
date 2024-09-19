import { z } from 'zod';

export const UpdateInventoryItemPathParamSchema = z.coerce.number().int();
export type UpdateInventoryItemPathParam = z.infer<
  typeof UpdateInventoryItemPathParamSchema
>;

export const UpdateInventoryItemRequestSchema = z
  .object({
    code: z.string().optional(),
    name: z.string().optional(),
    specification: z.string().optional(),
    manufacturer: z.string().optional(),
    inventoryUnitId: z.number().int().optional(),
    description: z.string().nullable().optional(),
    barcode: z.string().nullable().optional(),
    active: z.boolean().optional(),
    categoryId: z.number().int().nullable().optional(),
  })
  .strict();
export type UpdateInventoryItemRequest = z.infer<
  typeof UpdateInventoryItemRequestSchema
>;

export const UpdateInventoryItemResponseSchema = z
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
  .strict();
export type UpdateInventoryItemResponse = z.infer<
  typeof UpdateInventoryItemResponseSchema
>;
