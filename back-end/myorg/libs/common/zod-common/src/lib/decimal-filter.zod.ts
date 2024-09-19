import { z } from 'zod';
import { coerceDecimalSchema } from './coerce.zod';

// DecimalFilter schema
export const DecimalFilterSchema = z.object({
  equals: coerceDecimalSchema.optional(),
  in: z.array(coerceDecimalSchema).optional(),
  notIn: z.array(coerceDecimalSchema).optional(),
  lt: coerceDecimalSchema.optional(),
  lte: coerceDecimalSchema.optional(),
  gt: coerceDecimalSchema.optional(),
  gte: coerceDecimalSchema.optional(),
  not: coerceDecimalSchema.optional(),
});

// DecimalNullableFilter schema
export const DecimalNullableFilterSchema = z.object({
  equals: coerceDecimalSchema.nullable().optional(),
  in: z.array(coerceDecimalSchema).nullable().optional(),
  notIn: z.array(coerceDecimalSchema).nullable().optional(),
  lt: coerceDecimalSchema.optional(),
  lte: coerceDecimalSchema.optional(),
  gt: coerceDecimalSchema.optional(),
  gte: coerceDecimalSchema.optional(),
  not: coerceDecimalSchema.nullable().optional(),
});

// Type definitions
export type DecimalFilter = z.infer<typeof DecimalFilterSchema>;
export type DecimalNullableFilter = z.infer<typeof DecimalNullableFilterSchema>;

// // DecimalJsLike interface
// export interface DecimalJsLike {
//   d: number[];
//   e: number;
//   s: number;
//   toFixed(): string;
// }
