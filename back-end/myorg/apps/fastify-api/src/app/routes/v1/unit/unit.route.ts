import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GetUnitPathParamSchema, GetUnitResponse } from './get-unit.dto';
import { ListUnitQueryStringSchema, ListUnitResponse } from './list-unit.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListUnitQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const units = await prisma.unit.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          type: true,
        },
      });

      const resBody: ListUnitResponse = {
        items: units,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { unitId: string } }>(
    '/:unitId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { unitId: string } }>,
      res: FastifyReply
    ) => {
      const unitId = GetUnitPathParamSchema.parse(req.params.unitId);
      const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        include: {
          type: true,
        },
      });

      if (!unit) {
        res.status(404).send({ message: 'Unit not found' });
        return;
      }

      const resBody: GetUnitResponse = unit;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreateUnitRequestSchema.parse(req.body);

  //     type UnitCreateBody = Prisma.Args<
  //       typeof prisma.unit,
  //       'create'
  //     >['data'];

  //     const unitCreateBody: UnitCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const unit = await prisma.unit.create({
  //       data: unitCreateBody,
  //     });

  //     const resBody: CreateUnitResponse = unit;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { unitId: string } }>(
  //   '/:unitId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { unitId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const unitId = UpdateUnitPathParamSchema.parse(req.params.unitId);
  //     const updateData = UpdateUnitRequestSchema.parse(req.body);

  //     const unit = await prisma.unit.findUnique({
  //       where: { id: unitId },
  //     });

  //     if (!unit) {
  //       res.status(404).send({ message: 'Unit not found' });
  //       return;
  //     }

  //     const updatedUnit = await prisma.unit.update({
  //       where: { id: unit.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdateUnitResponse = updatedUnit;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { unitId: string } }>(
  //   '/:unitId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { unitId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const unitId = DeleteUnitPathParamSchema.parse(req.params.unitId);

  //     try {
  //       await prisma.unit.delete({
  //         where: { id: unitId },
  //       });
  //       const resBody: DeleteUnitResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'Unit',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'Unit not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
