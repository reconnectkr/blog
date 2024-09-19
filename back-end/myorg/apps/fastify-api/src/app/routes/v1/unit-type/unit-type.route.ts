import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetUnitTypePathParamSchema,
  GetUnitTypeResponse,
} from './get-unit-type.dto';
import {
  ListUnitTypeQueryStringSchema,
  ListUnitTypeResponse,
} from './list-unit-type.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListUnitTypeQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;

      const unitTypes = await prisma.unitType.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
      });

      const resBody: ListUnitTypeResponse = {
        items: unitTypes,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { unitTypeId: string } }>(
    '/:unitTypeId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { unitTypeId: string } }>,
      res: FastifyReply
    ) => {
      const unitTypeId = GetUnitTypePathParamSchema.parse(
        req.params.unitTypeId
      );
      const unitType = await prisma.unitType.findUnique({
        where: { id: unitTypeId },
      });

      if (!unitType) {
        res.status(404).send({ message: 'UnitType not found' });
        return;
      }

      const resBody: GetUnitTypeResponse = unitType;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreateUnitTypeRequestSchema.parse(req.body);

  //     type UnitTypeCreateBody = Prisma.Args<
  //       typeof prisma.unitType,
  //       'create'
  //     >['data'];

  //     const unitTypeCreateBody: UnitTypeCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const unitType = await prisma.unitType.create({
  //       data: unitTypeCreateBody,
  //     });

  //     const resBody: CreateUnitTypeResponse = unitType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { unitTypeId: string } }>(
  //   '/:unitTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { unitTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const unitTypeId = UpdateUnitTypePathParamSchema.parse(req.params.unitTypeId);
  //     const updateData = UpdateUnitTypeRequestSchema.parse(req.body);

  //     const unitType = await prisma.unitType.findUnique({
  //       where: { id: unitTypeId },
  //     });

  //     if (!unitType) {
  //       res.status(404).send({ message: 'UnitType not found' });
  //       return;
  //     }

  //     const updatedUnitType = await prisma.unitType.update({
  //       where: { id: unitType.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdateUnitTypeResponse = updatedUnitType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { unitTypeId: string } }>(
  //   '/:unitTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { unitTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const unitTypeId = DeleteUnitTypePathParamSchema.parse(req.params.unitTypeId);

  //     try {
  //       await prisma.unitType.delete({
  //         where: { id: unitTypeId },
  //       });
  //       const resBody: DeleteUnitTypeResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'UnitType',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'UnitType not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
