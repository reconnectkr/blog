import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { LockerTestData } from './commons';
import {
  GetLockerPathParamSchema,
  GetLockerResponse,
  GetLockerResponseSchema,
} from './get-locker.dto';
import {
  ListLockerResponse,
  ListLockerResponseSchema,
} from './list-locker.dto';
export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    // { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const lockers = LockerTestData;
      const resBody: ListLockerResponse = ListLockerResponseSchema.parse({
        items: lockers,
      });
      res.send(resBody);

      // const validatedQueryString = ListLockerQueryStringSchema.parse(req.query);
      // const { filter, orderBy } = validatedQueryString;
      // const page = validatedQueryString.page ?? 1;
      // const pageSize: number =
      //   validatedQueryString.pageSize !== undefined
      //     ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
      //     : PAGE_SIZE_DEFAULT;
      // const Lockers = await prisma.Locker.findMany({
      //   where: filter,
      //   skip: (page - 1) * pageSize,
      //   take: pageSize,
      //   orderBy: orderBy,
      //   include: {
      //     inventoryUnit: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //     category: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //   },
      // });

      // const resBody: ListLockerResponse = {
      //   items: Lockers,
      // };
      // res.send(resBody);
    }
  );

  fastify.get<{ Params: { LockerId: string } }>(
    '/:LockerId',
    // { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { LockerId: string } }>,
      res: FastifyReply
    ) => {
      const LockerId = GetLockerPathParamSchema.parse(req.params.LockerId);

      const lockers = LockerTestData;
      const locker = lockers.find((locker) => locker.id === LockerId);

      if (!locker) {
        res.status(404).send({ message: 'Locker not found' });
        return;
      }

      const resBody: GetLockerResponse = GetLockerResponseSchema.parse(locker);
      res.send(resBody);

      // const Locker = await prisma.Locker.findUnique({
      //   where: { id: LockerId },
      //   include: {
      //     inventoryUnit: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //     category: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //   },
      // });

      // if (!Locker) {
      //   res.status(404).send({ message: 'Locker not found' });
      //   return;
      // }

      // const resBody: GetLockerResponse = Locker;
      // res.send(resBody);
    }
  );

  // fastify.delete<{ Params: { LockerId: string } }>(
  //   '/:LockerId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { LockerId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const LockerId = DeleteLockerPathParamSchema.parse(
  //       req.params.LockerId
  //     );

  //     try {
  //       await prisma.Locker.delete({
  //         where: { id: LockerId },
  //       });
  //       const resBody: DeleteLockerResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'Locker',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'Locker not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );

  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreateLockerRequestSchema.parse(req.body);

  //     type LockerCreateBody = Prisma.Args<
  //       typeof prisma.Locker,
  //       'create'
  //     >['data'];

  //     const LockerCreateBody: LockerCreateBody = {
  //       ...validatedBody,
  //       createdBy: req.user.userId,
  //       updatedBy: req.user.userId,
  //     };

  //     const Locker = await prisma.Locker.create({
  //       data: LockerCreateBody,
  //     });

  //     const resBody: CreateLockerResponse = Locker;
  //     res.status(201).send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { LockerId: number } }>(
  //   '/:LockerId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { LockerId: number } }>,
  //     res: FastifyReply
  //   ) => {
  //     const LockerId = UpdateLockerPathParamSchema.parse(
  //       req.params.LockerId
  //     );
  //     const validatedBody = UpdateLockerRequestSchema.parse(req.body);
  //     try {
  //       const updatedLocker = await prisma.Locker.update({
  //         where: { id: LockerId },
  //         data: {
  //           ...validatedBody,
  //           updatedBy: req.user.userId,
  //         },
  //         include: {
  //           inventoryUnit: {
  //             select: {
  //               id: true,
  //               name: true,
  //             },
  //           },
  //           category: {
  //             select: {
  //               id: true,
  //               name: true,
  //             },
  //           },
  //         },
  //       });

  //       const resBody: UpdateLockerResponse = updatedLocker;
  //       res.send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'Locker not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
