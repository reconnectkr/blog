import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateUserRequestSchema,
  CreateUserResponse,
  DeleteUserPathParamSchema,
  DeleteUserResponse,
  GetUserPathParamSchema,
  GetUserResponse,
  ListUserQueryStringSchema,
  ListUserResponse,
  UpdateUserPathParamSchema,
  UpdateUserRequestSchema,
  UpdateUserResponse,
} from './dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListUserQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;

      const where: Prisma.UserWhereInput = {
        id: filter?.id,
        username: filter?.username,
        profile: {
          name: filter?.name,
          mobile: filter?.mobile,
          photo: filter?.photo,
          departmentId: filter?.departmentId,
        },
        active: filter?.active,
        createdAt: filter?.createdAt,
        updatedAt: filter?.updatedAt,
      };

      const users = await prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        include: {
          profile: true,
        },
      });

      const resBody: ListUserResponse = {
        items: users.map((user) => ({
          id: user.id,
          username: user.username,
          name: user.profile?.name ?? user.username,
          mobile: user.profile?.mobile ?? null,
          photo: user.profile?.photo ?? null,
          departmentId: user.profile?.departmentId ?? null,
        })),
      };
      res.send(resBody);
    }
  );

  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreateUserRequestSchema.parse(req.body);

  //     type UserCreateBody = Prisma.Args<typeof prisma.user, 'create'>['data'];

  //     const userCreateBody: UserCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const user = await prisma.user.create({
  //       data: userCreateBody,
  //     });

  //     const resBody: CreateUserResponse = user;
  //     res.send(resBody);
  //   }
  // );

  fastify.post(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedBody = CreateUserRequestSchema.parse(req.body);

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        validatedBody.password,
        saltRounds
      );
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          email: validatedBody.email,
          username: validatedBody.username,
          password: hashedPassword,
          profile: {
            create: {
              name: validatedBody.name,
              mobile: validatedBody.mobile,
              photo: validatedBody.photo,
              departmentId: validatedBody.departmentId,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      const profile = user.profile!;
      const resBody: CreateUserResponse = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: profile.name,
        mobile: profile.mobile,
        photo: profile.photo,
        departmentId: profile.departmentId,
      };
      res.status(201).send(resBody);
    }
  );

  fastify.get<{ Params: { userId: string } }>(
    '/:userId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      res: FastifyReply
    ) => {
      const userId = GetUserPathParamSchema.parse(req.params.userId);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              department: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }

      const resBody: GetUserResponse = {
        id: user.id,
        username: user.username,
        name: user.profile?.name ?? user.username,
        mobile: user.profile?.mobile ?? null,
        photo: user.profile?.photo ?? null,
        departmentId: user.profile?.departmentId ?? null,
      };

      res.send(resBody);
    }
  );

  // fastify.patch<{ Params: { userId: string } }>(
  //   '/:userId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { userId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const userId = UpdateUserPathParamSchema.parse(req.params.userId);
  //     const updateData = UpdateUserRequestSchema.parse(req.body);

  //     const user = await prisma.user.findUnique({
  //       where: { id: userId },
  //     });

  //     if (!user) {
  //       res.status(404).send({ message: 'User not found' });
  //       return;
  //     }

  //     const updatedUser = await prisma.user.update({
  //       where: { id: user.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdateUserResponse = updatedUser;
  //     res.send(resBody);
  //   }
  // );

  fastify.patch<{ Params: { userId: string } }>(
    '/:userId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      res: FastifyReply
    ) => {
      const userId = UpdateUserPathParamSchema.parse(req.params.userId);
      const updateData = UpdateUserRequestSchema.parse(req.body);

      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            email: updateData.email,
            username: updateData.username,
            password: updateData.password
              ? await bcrypt.hash(updateData.password, 10)
              : undefined,
            profile: {
              update: {
                name: updateData.name,
                mobile: updateData.mobile,
                photo: updateData.photo,
                departmentId: updateData.departmentId,
              },
            },
            active: updateData.active,
          },
          include: {
            profile: true,
          },
        });

        const resBody: UpdateUserResponse = {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          name: updatedUser.profile?.name ?? updatedUser.username,
          mobile: updatedUser.profile?.mobile ?? null,
          photo: updatedUser.profile?.photo ?? null,
          departmentId: updatedUser.profile?.departmentId ?? null,
          active: updatedUser.active,
        };
        res.send(resBody);
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          res.status(404).send({ message: 'User not found' });
          return;
        }
        throw error;
      }
    }
  );

  fastify.delete<{ Params: { userId: string } }>(
    '/:userId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      res: FastifyReply
    ) => {
      const userId = DeleteUserPathParamSchema.parse(req.params.userId);

      try {
        await prisma.user.delete({
          where: { id: userId },
        });
        const resBody: DeleteUserResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'User',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'User not found' });
            return;
          }
        }
      }
    }
  );
}
