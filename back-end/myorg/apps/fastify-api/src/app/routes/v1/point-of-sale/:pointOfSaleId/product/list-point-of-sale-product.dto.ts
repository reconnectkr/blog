import {
  AscendingDecendingSchema,
  coerceDecimalSchema,
  DateTimeFilterSchema,
  DecimalFilterSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListPointOfSaleProductOrderBySchema = z.object({
  pointOfSale: z
    .object({
      id: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
      department: z
        .object({
          id: AscendingDecendingSchema.optional(),
          name: AscendingDecendingSchema.optional(),
        })
        .optional(),
    })
    .optional(),
  product: z
    .object({
      id: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
      price: AscendingDecendingSchema.optional(),
      description: AscendingDecendingSchema.optional(),
    })
    .optional(),
  createdAt: AscendingDecendingSchema.optional(),
  createdBy: AscendingDecendingSchema.optional(),
});

export const ListPointOfSaleProductQueryStringSchema = z
  .object({
    filter: z
      .object({
        pointOfSale: z
          .object({
            id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
            name: z.union([z.string(), StringFilterSchema]).optional(),
            department: z
              .object({
                id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
                name: z.union([z.string(), StringFilterSchema]).optional(),
              })
              .optional(),
            createdAt: z
              .union([z.coerce.date(), DateTimeFilterSchema])
              .optional(),
            createdBy: z.union([z.string(), StringFilterSchema]).optional(),
            updatedAt: z
              .union([z.coerce.date(), DateTimeFilterSchema])
              .optional(),
            updatedBy: z.union([z.string(), StringFilterSchema]).optional(),
          })
          .optional(),
        product: z
          .object({
            id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
            name: z.union([z.string(), StringFilterSchema]).optional(),
            price: z
              .union([coerceDecimalSchema, DecimalFilterSchema])
              .optional(),
            description: z.union([z.string(), StringFilterSchema]).optional(),
            createdAt: z
              .union([z.coerce.date(), DateTimeFilterSchema])
              .optional(),
            createdBy: z.union([z.string(), StringFilterSchema]).optional(),
            updatedAt: z
              .union([z.coerce.date(), DateTimeFilterSchema])
              .optional(),
            updatedBy: z.union([z.string(), StringFilterSchema]).optional(),
          })
          .optional(),

        createdAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        createdBy: z.union([z.string(), StringFilterSchema]).optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([
        ListPointOfSaleProductOrderBySchema,
        ListPointOfSaleProductOrderBySchema.array(),
      ])
      .default([{ pointOfSale: { id: 'asc' } }, { product: { id: 'asc' } }]),
  })
  .strict();
export type ListPointOfSaleProductQueryString = z.infer<
  typeof ListPointOfSaleProductQueryStringSchema
>;

export const ListPointOfSaleProductResponseSchema = z
  .object({
    items: z
      .object({
        product: z.object({
          id: z.number().int(),
          name: z.string(),
          price: coerceDecimalSchema,
          description: z.string().nullable(),
        }),
        createdAt: z.coerce.date(),
        createdBy: z.string(),
      })
      .array(),
  })
  .strict();
export type ListPointOfSaleProductResponse = z.infer<
  typeof ListPointOfSaleProductResponseSchema
>;
