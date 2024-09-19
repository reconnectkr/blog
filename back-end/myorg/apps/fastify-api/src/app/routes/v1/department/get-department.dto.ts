import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetDepartmentPathParamSchema = z.coerce.number().int();
export type GetDepartmentPathParam = z.infer<
  typeof GetDepartmentPathParamSchema
>;

export const GetDepartmentResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
  })
  .strict();
export type GetDepartmentResponse = z.infer<typeof GetDepartmentResponseSchema>;
