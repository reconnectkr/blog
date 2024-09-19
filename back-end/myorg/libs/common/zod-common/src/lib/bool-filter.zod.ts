import { z } from 'zod';
import { coerceBooleanSchema } from './coerce.zod';

// StringFilter schema
export const BoolFilterSchema = z.object({
  equals: coerceBooleanSchema.optional(),
  not: coerceBooleanSchema.optional(),
});

// StringNullableFilter schema
export const BoolNullableFilterSchema = z.object({
  equals: coerceBooleanSchema.nullable().optional(),
  not: coerceBooleanSchema.nullable().optional(),
});

// Type inference
export type BoolFilter = z.infer<typeof BoolFilterSchema>;
export type BoolNullableFilter = z.infer<typeof BoolNullableFilterSchema>;
