import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateProductRequestSchema,
  CreateProductResponse,
} from './create-product.dto';
import {
  DeleteProductPathParamSchema,
  DeleteProductResponse,
} from './delete-product.dto';
import {
  GetProductPathParamSchema,
  GetProductResponse,
} from './get-product.dto';
import {
  ListProductQueryStringSchema,
  ListProductResponse,
} from './list-product.dto';
import {
  UpdateProductPathParamSchema,
  UpdateProductRequestSchema,
  UpdateProductResponse,
} from './update-product.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListProductQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const products = await prisma.product.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListProductResponse = {
        items: products,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { productId: string } }>(
    '/:productId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { productId: string } }>,
      res: FastifyReply
    ) => {
      const productId = GetProductPathParamSchema.parse(req.params.productId);
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        res.status(404).send({ message: 'Product not found' });
        return;
      }

      const resBody: GetProductResponse = product;
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { productId: string } }>(
    '/:productId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { productId: string } }>,
      res: FastifyReply
    ) => {
      const productId = DeleteProductPathParamSchema.parse(
        req.params.productId
      );

      try {
        await prisma.productInventoryItem.deleteMany({
          where: { productId: productId },
        });

        await prisma.product.delete({
          where: { id: productId },
        });
        const resBody: DeleteProductResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'Product',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'Product not found' });
            return;
          }
        }

        throw error;
      }
    }
  );

  fastify.post(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedBody = CreateProductRequestSchema.parse(req.body);

      type ProductCreateBody = Prisma.Args<
        typeof prisma.product,
        'create'
      >['data'];

      const productCreateBody: ProductCreateBody = {
        ...validatedBody,
        createdBy: req.user.userId,
        updatedBy: req.user.userId,
      };

      const product = await prisma.product.create({
        data: productCreateBody,
      });

      const resBody: CreateProductResponse = product;
      res.status(201).send(resBody);
    }
  );

  fastify.patch<{ Params: { productId: number } }>(
    '/:productId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { productId: number } }>,
      res: FastifyReply
    ) => {
      const productId = UpdateProductPathParamSchema.parse(
        req.params.productId
      );
      const validatedBody = UpdateProductRequestSchema.parse(req.body);
      try {
        const updatedProduct = await prisma.product.update({
          where: { id: productId },
          data: {
            ...validatedBody,
            updatedBy: req.user.userId,
          },
        });

        const resBody: UpdateProductResponse = updatedProduct;
        res.send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'Product not found' });
            return;
          }
        }
      }
    }
  );
}
