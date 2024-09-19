import { z } from 'zod';

export const GetUnitPathParamSchema = z.coerce.number().int();
export type GetUnitPathParam = z.infer<typeof GetUnitPathParamSchema>;

export const GetUnitResponseSchema = z
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
  .strict();
export type GetUnitResponse = z.infer<typeof GetUnitResponseSchema>;
