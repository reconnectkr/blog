import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateInventoryItemRequestSchema,
  CreateInventoryItemResponse,
} from './create-inventory-item.dto';
import {
  DeleteInventoryItemPathParamSchema,
  DeleteInventoryItemResponse,
} from './delete-inventory-item.dto';
import {
  GetInventoryItemPathParamSchema,
  GetInventoryItemResponse,
} from './get-inventory-item.dto';
import {
  ListInventoryItemQueryStringSchema,
  ListInventoryItemResponse,
} from './list-inventory-item.dto';
import {
  UpdateInventoryItemPathParamSchema,
  UpdateInventoryItemRequestSchema,
  UpdateInventoryItemResponse,
} from './update-inventory-item.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListInventoryItemQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const inventoryItems = await prisma.inventoryItem.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          inventoryUnit: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const resBody: ListInventoryItemResponse = {
        items: inventoryItems,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { inventoryItemId: string } }>(
    '/:inventoryItemId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { inventoryItemId: string } }>,
      res: FastifyReply
    ) => {
      const inventoryItemId = GetInventoryItemPathParamSchema.parse(
        req.params.inventoryItemId
      );
      const inventoryItem = await prisma.inventoryItem.findUnique({
        where: { id: inventoryItemId },
        include: {
          inventoryUnit: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!inventoryItem) {
        res.status(404).send({ message: 'InventoryItem not found' });
        return;
      }

      const resBody: GetInventoryItemResponse = inventoryItem;
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { inventoryItemId: string } }>(
    '/:inventoryItemId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { inventoryItemId: string } }>,
      res: FastifyReply
    ) => {
      const inventoryItemId = DeleteInventoryItemPathParamSchema.parse(
        req.params.inventoryItemId
      );

      try {
        await prisma.inventoryItem.delete({
          where: { id: inventoryItemId },
        });
        const resBody: DeleteInventoryItemResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'InventoryItem',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'InventoryItem not found' });
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
      const validatedBody = CreateInventoryItemRequestSchema.parse(req.body);

      type InventoryItemCreateBody = Prisma.Args<
        typeof prisma.inventoryItem,
        'create'
      >['data'];

      const inventoryItemCreateBody: InventoryItemCreateBody = {
        ...validatedBody,
        createdBy: req.user.userId,
        updatedBy: req.user.userId,
      };

      const inventoryItem = await prisma.inventoryItem.create({
        data: inventoryItemCreateBody,
      });

      const resBody: CreateInventoryItemResponse = inventoryItem;
      res.status(201).send(resBody);
    }
  );

  fastify.patch<{ Params: { inventoryItemId: number } }>(
    '/:inventoryItemId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { inventoryItemId: number } }>,
      res: FastifyReply
    ) => {
      const inventoryItemId = UpdateInventoryItemPathParamSchema.parse(
        req.params.inventoryItemId
      );
      const validatedBody = UpdateInventoryItemRequestSchema.parse(req.body);
      try {
        const updatedInventoryItem = await prisma.inventoryItem.update({
          where: { id: inventoryItemId },
          data: {
            ...validatedBody,
            updatedBy: req.user.userId,
          },
          include: {
            inventoryUnit: {
              select: {
                id: true,
                name: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        const resBody: UpdateInventoryItemResponse = updatedInventoryItem;
        res.send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'InventoryItem not found' });
            return;
          }
        }
      }
    }
  );
}
