import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetInventoryPlacePathParamSchema,
  GetInventoryPlaceResponse,
} from './get-inventory-place.dto';
import {
  ListInventoryPlaceQueryStringSchema,
  ListInventoryPlaceResponse,
} from './list-inventory-place.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListInventoryPlaceQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const inventoryPlaces = await prisma.inventoryPlace.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          department: true,
        },
      });

      const resBody: ListInventoryPlaceResponse = {
        items: inventoryPlaces,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { inventoryPlaceId: string } }>(
    '/:inventoryPlaceId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { inventoryPlaceId: string } }>,
      res: FastifyReply
    ) => {
      const inventoryPlaceId = GetInventoryPlacePathParamSchema.parse(
        req.params.inventoryPlaceId
      );
      const inventoryPlace = await prisma.inventoryPlace.findUnique({
        where: { id: inventoryPlaceId },
        include: {
          department: true,
        },
      });

      if (!inventoryPlace) {
        res.status(404).send({ message: 'InventoryPlace not found' });
        return;
      }

      const resBody: GetInventoryPlaceResponse = inventoryPlace;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreateInventoryPlaceRequestSchema.parse(req.body);

  //     type InventoryPlaceCreateBody = Prisma.Args<
  //       typeof prisma.inventoryPlace,
  //       'create'
  //     >['data'];

  //     const inventoryPlaceCreateBody: InventoryPlaceCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const inventoryPlace = await prisma.inventoryPlace.create({
  //       data: inventoryPlaceCreateBody,
  //     });

  //     const resBody: CreateInventoryPlaceResponse = inventoryPlace;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { inventoryPlaceId: string } }>(
  //   '/:inventoryPlaceId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { inventoryPlaceId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const inventoryPlaceId = UpdateInventoryPlacePathParamSchema.parse(req.params.inventoryPlaceId);
  //     const updateData = UpdateInventoryPlaceRequestSchema.parse(req.body);

  //     const inventoryPlace = await prisma.inventoryPlace.findUnique({
  //       where: { id: inventoryPlaceId },
  //     });

  //     if (!inventoryPlace) {
  //       res.status(404).send({ message: 'InventoryPlace not found' });
  //       return;
  //     }

  //     const updatedInventoryPlace = await prisma.inventoryPlace.update({
  //       where: { id: inventoryPlace.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdateInventoryPlaceResponse = updatedInventoryPlace;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { inventoryPlaceId: string } }>(
  //   '/:inventoryPlaceId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { inventoryPlaceId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const inventoryPlaceId = DeleteInventoryPlacePathParamSchema.parse(req.params.inventoryPlaceId);

  //     try {
  //       await prisma.inventoryPlace.delete({
  //         where: { id: inventoryPlaceId },
  //       });
  //       const resBody: DeleteInventoryPlaceResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'InventoryPlace',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'InventoryPlace not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
