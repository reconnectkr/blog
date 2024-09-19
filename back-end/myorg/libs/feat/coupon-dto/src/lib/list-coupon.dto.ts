import {
  AscendingDecendingSchema,
  coerceDecimalSchema,
  DateTimeFilterSchema,
  DateTimeNullableFilterSchema,
  DecimalNullableFilterSchema,
  IntFilterSchema,
  NullableSortOrderSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
  StringNullableFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListCouponOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  code: AscendingDecendingSchema.optional(),
  issuedBy: AscendingDecendingSchema.optional(),
  issuedAt: AscendingDecendingSchema.optional(),
  expiredAt: AscendingDecendingSchema.optional(),
  price: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
  rate: z.union([AscendingDecendingSchema, NullableSortOrderSchema]).optional(),
  retrievedAt: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
  retrievedBy: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
});

export const ListCouponQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        code: z.union([z.string(), StringFilterSchema]).optional(),
        issuedBy: z.union([z.string(), StringFilterSchema]).optional(),
        issuedAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        expiredAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        price: z
          .union([coerceDecimalSchema.nullable(), DecimalNullableFilterSchema])
          .optional(),
        rate: z
          .union([coerceDecimalSchema.nullable(), DecimalNullableFilterSchema])
          .optional(),
        retrievedAt: z
          .union([z.coerce.date().nullable(), DateTimeNullableFilterSchema])
          .optional(),
        retrievedBy: z
          .union([z.string().nullable(), StringNullableFilterSchema])
          .optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([ListCouponOrderBySchema, ListCouponOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListCouponQueryString = z.infer<typeof ListCouponQueryStringSchema>;

export const ListCouponResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        code: z.string(),
        issuedBy: z.string(),
        issuedAt: z.coerce.date(),
        expiredAt: z.coerce.date(),
        price: coerceDecimalSchema.nullable().optional(),
        rate: coerceDecimalSchema.nullable().optional(),
        retrievedAt: z.coerce.date().nullable().optional(),
        retrievedBy: z.string().nullable().optional(),
      })
      .array(),
  })
  .strict();
export type ListCouponResponse = z.infer<typeof ListCouponResponseSchema>;
