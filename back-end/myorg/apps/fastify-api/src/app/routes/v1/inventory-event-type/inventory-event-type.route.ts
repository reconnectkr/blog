import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetInventoryEventTypePathParamSchema,
  GetInventoryEventTypeResponse,
} from './get-inventory-event-type.dto';
import {
  ListInventoryEventTypeQueryStringSchema,
  ListInventoryEventTypeResponse,
} from './list-inventory-event-type.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString =
        ListInventoryEventTypeQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const inventoryEventTypes = await prisma.inventoryEventType.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListInventoryEventTypeResponse = {
        items: inventoryEventTypes,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { inventoryEventTypeId: string } }>(
    '/:inventoryEventTypeId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { inventoryEventTypeId: string } }>,
      res: FastifyReply
    ) => {
      const inventoryEventTypeId = GetInventoryEventTypePathParamSchema.parse(
        req.params.inventoryEventTypeId
      );
      const inventoryEventType = await prisma.inventoryEventType.findUnique({
        where: { id: inventoryEventTypeId },
      });

      if (!inventoryEventType) {
        res.status(404).send({ message: 'InventoryEventType not found' });
        return;
      }

      const resBody: GetInventoryEventTypeResponse = inventoryEventType;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreateInventoryEventTypeRequestSchema.parse(req.body);

  //     type InventoryEventTypeCreateBody = Prisma.Args<
  //       typeof prisma.inventoryEventType,
  //       'create'
  //     >['data'];

  //     const inventoryEventTypeCreateBody: InventoryEventTypeCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const inventoryEventType = await prisma.inventoryEventType.create({
  //       data: inventoryEventTypeCreateBody,
  //     });

  //     const resBody: CreateInventoryEventTypeResponse = inventoryEventType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { inventoryEventTypeId: string } }>(
  //   '/:inventoryEventTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { inventoryEventTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const inventoryEventTypeId = UpdateInventoryEventTypePathParamSchema.parse(req.params.inventoryEventTypeId);
  //     const updateData = UpdateInventoryEventTypeRequestSchema.parse(req.body);

  //     const inventoryEventType = await prisma.inventoryEventType.findUnique({
  //       where: { id: inventoryEventTypeId },
  //     });

  //     if (!inventoryEventType) {
  //       res.status(404).send({ message: 'InventoryEventType not found' });
  //       return;
  //     }

  //     const updatedInventoryEventType = await prisma.inventoryEventType.update({
  //       where: { id: inventoryEventType.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdateInventoryEventTypeResponse = updatedInventoryEventType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { inventoryEventTypeId: string } }>(
  //   '/:inventoryEventTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { inventoryEventTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const inventoryEventTypeId = DeleteInventoryEventTypePathParamSchema.parse(req.params.inventoryEventTypeId);

  //     try {
  //       await prisma.inventoryEventType.delete({
  //         where: { id: inventoryEventTypeId },
  //       });
  //       const resBody: DeleteInventoryEventTypeResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'InventoryEventType',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'InventoryEventType not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
