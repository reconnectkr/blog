import { z } from 'zod';

export const GetInventoryItemPathParamSchema = z.coerce.number().int();
export type GetInventoryItemPathParam = z.infer<
  typeof GetInventoryItemPathParamSchema
>;

export const GetInventoryItemResponseSchema = z
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
export type GetInventoryItemResponse = z.infer<
  typeof GetInventoryItemResponseSchema
>;
