import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  getCurrentLockerStatus,
  LOCKER_ACTION_NAME_DISABLE,
  LOCKER_STATUS_AVAILABLE,
  LOCKER_STATUS_DISABLED,
  LOCKER_STATUS_OCCUPIED,
} from './commons';
import {
  CreateLockerRequestSchema,
  CreateLockerResponse,
  CreateLockerResponseSchema,
} from './create-locker.dto';
import {
  DeleteLockerPathParamSchema,
  DeleteLockerResponse,
} from './delete-locker.dto';
import {
  DisableLockerPathParamSchema,
  DisableLockerRequestSchema,
} from './disable-locker.dto';
import {
  GetLockerPathParamSchema,
  GetLockerResponse,
  GetLockerResponseSchema,
} from './get-locker.dto';
import {
  ListLockerQueryStringSchema,
  ListLockerResponse,
} from './list-locker.dto';
import {
  UpdateLockerPathParamSchema,
  UpdateLockerRequestSchema,
  UpdateLockerResponse,
  UpdateLockerResponseSchema,
} from './update-locker.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    // { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListLockerQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const lockers = await prisma.locker.findMany({
        where: { ...filter, isDeleted: false },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          actionLogs: {
            select: {
              createdAt: true,
              reservationId: true,
              userId: true,
              action: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      const resBody: ListLockerResponse = {
        items: lockers.map((locker) => {
          const lockerStatus =
            locker.actionLogs.length === 1
              ? getCurrentLockerStatus(locker.actionLogs[0].action.name)
              : LOCKER_STATUS_AVAILABLE;
          return {
            id: locker.id,
            name: locker.name,
            lockerRoomId: locker.lockerRoomId,
            status: lockerStatus,
            assignment:
              lockerStatus === LOCKER_STATUS_OCCUPIED
                ? {
                    assignedAt: locker.actionLogs[0].createdAt,
                    userId: locker.actionLogs[0].userId!,
                    reservationId: locker.actionLogs[0].reservationId ?? null,
                  }
                : null,
          };
        }),
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { lockerId: string } }>(
    '/:lockerId',
    // { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { lockerId: string } }>,
      res: FastifyReply
    ) => {
      const lockerId = GetLockerPathParamSchema.parse(req.params.lockerId);
      const locker = await prisma.locker.findUnique({
        where: { id: lockerId, isDeleted: false },
        include: {
          actionLogs: {
            select: {
              createdAt: true,
              reservationId: true,
              userId: true,
              action: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      if (!locker) {
        res.status(404).send({ error: 'Locker not found' });
        return;
      }

      const lockerStatus =
        locker.actionLogs.length === 1
          ? getCurrentLockerStatus(locker.actionLogs[0].action.name)
          : LOCKER_STATUS_AVAILABLE;

      const resBody: GetLockerResponse = GetLockerResponseSchema.parse({
        id: locker.id,
        name: locker.name,
        lockerRoomId: locker.lockerRoomId,
        status: lockerStatus,
        assignment:
          lockerStatus === LOCKER_STATUS_OCCUPIED
            ? {
                assignedAt: locker.actionLogs[0].createdAt,
                userId: locker.actionLogs[0].userId!,
                reservationId: locker.actionLogs[0].reservationId ?? null,
              }
            : null,
      });
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { lockerId: string } }>(
    '/:lockerId',
    // { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { lockerId: string } }>,
      res: FastifyReply
    ) => {
      const lockerId = DeleteLockerPathParamSchema.parse(req.params.lockerId);

      try {
        await prisma.locker.update({
          where: { id: lockerId, isDeleted: false },
          data: {
            isDeleted: true,
          },
        });
        const resBody: DeleteLockerResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'Locker',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ error: 'Locker not found' });
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
      const validatedBody = CreateLockerRequestSchema.parse(req.body);

      type LockerCreateBody = Prisma.Args<
        typeof prisma.locker,
        'create'
      >['data'];

      const lockerCreateBody: LockerCreateBody = {
        ...validatedBody,
        // createdBy: req.user.userId,
        // updatedBy: req.user.userId,
      };

      const locker = await prisma.locker.create({
        data: lockerCreateBody,
      });

      const resBody: CreateLockerResponse = CreateLockerResponseSchema.parse({
        id: locker.id,
        lockerRoomId: locker.lockerRoomId,
        name: locker.name,
        status: LOCKER_STATUS_AVAILABLE,
      });
      res.status(201).send(resBody);
    }
  );

  fastify.patch<{ Params: { lockerId: number } }>(
    '/:lockerId',
    // { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { lockerId: number } }>,
      res: FastifyReply
    ) => {
      const lockerId = UpdateLockerPathParamSchema.parse(req.params.lockerId);
      const validatedBody = UpdateLockerRequestSchema.parse(req.body);
      try {
        const updatedLocker = await prisma.locker.update({
          where: { id: lockerId, isDeleted: false },
          data: {
            ...validatedBody,
            // updatedBy: req.user.userId,
          },
          include: {
            actionLogs: {
              select: {
                createdAt: true,
                reservationId: true,
                userId: true,
                action: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        });

        const lockerStatus =
          updatedLocker.actionLogs.length === 1
            ? getCurrentLockerStatus(updatedLocker.actionLogs[0].action.name)
            : LOCKER_STATUS_AVAILABLE;

        const resBody: UpdateLockerResponse = UpdateLockerResponseSchema.parse({
          id: updatedLocker.id,
          name: updatedLocker.name,
          lockerRoomId: updatedLocker.lockerRoomId,
          status: lockerStatus,
          assignment:
            lockerStatus === LOCKER_STATUS_OCCUPIED
              ? {
                  assignedAt: updatedLocker.actionLogs[0].createdAt,
                  userId: updatedLocker.actionLogs[0].userId!,
                  reservationId:
                    updatedLocker.actionLogs[0].reservationId ?? null,
                }
              : null,
        });
        res.send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ error: 'Locker not found' });
            return;
          }
        }
      }
    }
  );

  fastify.post<{ Params: { lockerId: number } }>(
    '/:lockerId/disable',
    // { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { lockerId: number } }>,
      res: FastifyReply
    ) => {
      try {
        const lockerId = DisableLockerPathParamSchema.parse(
          req.params.lockerId
        );
        const validatedBody = DisableLockerRequestSchema.parse(req.body);

        const locker = await prisma.locker.findUniqueOrThrow({
          where: { id: lockerId, isDeleted: false },
          include: {
            actionLogs: {
              select: {
                createdAt: true,
                reservationId: true,
                userId: true,
                action: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        });

        const actionLog =
          locker.actionLogs.length > 0 ? locker.actionLogs[0] : undefined;

        if (actionLog) {
          const lockerStatus = getCurrentLockerStatus(actionLog.action.name);
          if (lockerStatus === LOCKER_STATUS_OCCUPIED) {
            res.status(400).send({ error: 'Locker is occupied' });
            return;
          } else if (lockerStatus === LOCKER_STATUS_DISABLED) {
            res.status(204).send();
            return;
          }
        }

        await prisma.lockerActionLog.create({
          data: {
            locker: {
              connect: {
                id: lockerId,
              },
            },
            action: {
              connect: {
                name: LOCKER_ACTION_NAME_DISABLE,
              },
            },
            reason: validatedBody.reason,
          },
        });

        const resBody: UpdateLockerResponse = UpdateLockerResponseSchema.parse({
          id: locker.id,
          name: locker.name,
          lockerRoomId: locker.lockerRoomId,
          status: LOCKER_STATUS_DISABLED,
        });
        res.send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ error: 'Locker not found' });
            return;
          }
        }
      }
    }
  );
}
