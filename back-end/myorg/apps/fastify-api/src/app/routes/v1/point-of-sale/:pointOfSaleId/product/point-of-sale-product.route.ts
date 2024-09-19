import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  CreatePointOfSaleProductRequest,
  CreatePointOfSaleProductRequestSchema,
  CreatePointOfSaleProductResponse,
} from './create-point-of-sale-product.dto';
import { DeletePointOfSaleProductResponse } from './delete-point-of-sale-product.dto';
import {
  GetPointOfSaleProductResponse,
  PointOfSaleIdPathParamSchema,
  ProductIdPathParamSchema,
} from './get-point-of-sale-product.dto';
import {
  ListPointOfSaleProductQueryStringSchema,
  ListPointOfSaleProductResponse,
} from './list-point-of-sale-product.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get<{ Params: { pointOfSaleId: string } }>(
    '/',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { pointOfSaleId: string } }>,
      res: FastifyReply
    ) => {
      const pointOfSaleId = PointOfSaleIdPathParamSchema.parse(
        req.params.pointOfSaleId
      );
      const validatedQueryString =
        ListPointOfSaleProductQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const pointOfSaleProducts = await prisma.pointOfSaleProduct.findMany({
        where: {
          ...filter,
          pointOfSaleId: pointOfSaleId,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });

      const resBody: ListPointOfSaleProductResponse = {
        items: pointOfSaleProducts,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { pointOfSaleId: string; productId: string } }>(
    '/:productId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{
        Params: { pointOfSaleId: string; productId: string };
      }>,
      res: FastifyReply
    ) => {
      const pointOfSaleId = PointOfSaleIdPathParamSchema.parse(
        req.params.pointOfSaleId
      );
      const productId = ProductIdPathParamSchema.parse(req.params.productId);

      const pointOfSaleProduct = await prisma.pointOfSaleProduct.findUnique({
        where: {
          pointOfSaleId_productId: {
            pointOfSaleId: pointOfSaleId,
            productId: productId,
          },
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });

      if (!pointOfSaleProduct) {
        res.status(404).send({ message: 'PointOfSaleProduct not found' });
        return;
      }

      const resBody: GetPointOfSaleProductResponse = pointOfSaleProduct;
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { pointOfSaleId: string; productId: string } }>(
    '/:productId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{
        Params: { pointOfSaleId: string; productId: string };
      }>,
      res: FastifyReply
    ) => {
      const pointOfSaleId = PointOfSaleIdPathParamSchema.parse(
        req.params.pointOfSaleId
      );
      const productId = ProductIdPathParamSchema.parse(req.params.productId);

      try {
        await prisma.pointOfSaleProduct.delete({
          where: {
            pointOfSaleId_productId: {
              pointOfSaleId: pointOfSaleId,
              productId: productId,
            },
          },
        });
        const resBody: DeletePointOfSaleProductResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'PointOfSaleProduct',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'PointOfSaleProduct not found' });
            return;
          }
        }

        throw error;
      }
    }
  );

  fastify.post<{
    Params: { pointOfSaleId: string };
    Body: CreatePointOfSaleProductRequest;
  }>(
    '/',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{
        Params: { pointOfSaleId: string };
        Body: CreatePointOfSaleProductRequest;
      }>,
      res: FastifyReply
    ) => {
      const pointOfSaleId = PointOfSaleIdPathParamSchema.parse(
        req.params.pointOfSaleId
      );
      const validatedBody = CreatePointOfSaleProductRequestSchema.parse({
        ...req.body,
      });

      type PointOfSaleProductCreateBody = Prisma.Args<
        typeof prisma.pointOfSaleProduct,
        'create'
      >['data'];

      const pointOfSaleProductCreateBody: PointOfSaleProductCreateBody = {
        ...validatedBody,
        pointOfSaleId,
        createdBy: req.user.userId,
      };
      const pointOfSaleProduct = await prisma.pointOfSaleProduct.create({
        data: pointOfSaleProductCreateBody,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });

      const resBody: CreatePointOfSaleProductResponse = pointOfSaleProduct;
      res.status(201).send(resBody);
    }
  );
}
