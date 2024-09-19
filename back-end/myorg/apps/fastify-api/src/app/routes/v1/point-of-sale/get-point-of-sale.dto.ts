import { z } from 'zod';

export const GetPointOfSalePathParamSchema = z.coerce.number().int();
export type GetPointOfSalePathParam = z.infer<
  typeof GetPointOfSalePathParamSchema
>;

export const GetPointOfSaleResponseSchema = z
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
export type GetPointOfSaleResponse = z.infer<
  typeof GetPointOfSaleResponseSchema
>;
