import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateCategoryRequestSchema,
  CreateCategoryResponse,
} from './create-category.dto';
import {
  DeleteCategoryPathParamSchema,
  DeleteCategoryResponse,
} from './delete-category.dto';
import {
  GetCategoryPathParamSchema,
  GetCategoryResponse,
} from './get-category.dto';
import {
  ListCategoryQueryStringSchema,
  ListCategoryResponse,
} from './list-category.dto';
import {
  UpdateCategoryPathParamSchema,
  UpdateCategoryRequestSchema,
  UpdateCategoryResponse,
} from './update-category.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get<{ Params: { categoryId: string } }>(
    '/:categoryId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { categoryId: string } }>,
      res: FastifyReply
    ) => {
      const categoryId = GetCategoryPathParamSchema.parse(
        req.params.categoryId
      );
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        res.status(404).send({ message: 'Category not found' });
        return;
      }

      const resBody: GetCategoryResponse = category;
      res.send(resBody);
    }
  );

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListCategoryQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const categorys = await prisma.category.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListCategoryResponse = {
        items: categorys,
      };
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { categoryId: string } }>(
    '/:categoryId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { categoryId: string } }>,
      res: FastifyReply
    ) => {
      const categoryId = DeleteCategoryPathParamSchema.parse(
        req.params.categoryId
      );

      try {
        await prisma.category.delete({
          where: { id: categoryId },
        });
        const resBody: DeleteCategoryResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'Category',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'Category not found' });
            return;
          }
        }
      }
    }
  );

  fastify.post(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedBody = CreateCategoryRequestSchema.parse(req.body);

      type CategoryCreateBody = Prisma.Args<
        typeof prisma.category,
        'create'
      >['data'];

      const categoryCreateBody: CategoryCreateBody = {
        ...validatedBody,
        // createdBy: req.user.userId,
        // updatedBy: req.user.userId,
      };

      const category = await prisma.category.create({
        data: {
          name: validatedBody.name,
        },
      });

      const resBody: CreateCategoryResponse = category;
      res.status(201).send(resBody);
    }
  );

  fastify.patch<{ Params: { categoryId: number } }>(
    '/:categoryId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { categoryId: number } }>,
      res: FastifyReply
    ) => {
      const categoryId = UpdateCategoryPathParamSchema.parse(
        req.params.categoryId
      );
      const validatedBody = UpdateCategoryRequestSchema.parse(req.body);
      try {
        const updatedCategory = await prisma.category.update({
          where: { id: categoryId },
          data: {
            ...validatedBody,
            // updatedBy: req.user.userId,
          },
        });

        const resBody: UpdateCategoryResponse = updatedCategory;
        res.send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'Category not found' });
            return;
          }
        }
      }
    }
  );
}
