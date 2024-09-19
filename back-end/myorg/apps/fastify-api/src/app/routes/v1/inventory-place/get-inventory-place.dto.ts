import { z } from 'zod';

export const GetInventoryPlacePathParamSchema = z.coerce.number().int();
export type GetInventoryPlacePathParam = z.infer<
  typeof GetInventoryPlacePathParamSchema
>;

export const GetInventoryPlaceResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    department: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
    }),
  })
  .strict();
export type GetInventoryPlaceResponse = z.infer<
  typeof GetInventoryPlaceResponseSchema
>;
