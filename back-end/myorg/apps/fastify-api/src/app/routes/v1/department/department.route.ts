import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetDepartmentPathParamSchema,
  GetDepartmentResponse,
} from './get-department.dto';
import {
  ListDepartmentQueryStringSchema,
  ListDepartmentResponse,
} from './list-department.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListDepartmentQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const departments = await prisma.department.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListDepartmentResponse = {
        items: departments,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { departmentId: string } }>(
    '/:departmentId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { departmentId: string } }>,
      res: FastifyReply
    ) => {
      const departmentId = GetDepartmentPathParamSchema.parse(
        req.params.departmentId
      );
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        res.status(404).send({ message: 'Department not found' });
        return;
      }

      const resBody: GetDepartmentResponse = department;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreateDepartmentRequestSchema.parse(req.body);

  //     type DepartmentCreateBody = Prisma.Args<
  //       typeof prisma.department,
  //       'create'
  //     >['data'];

  //     const departmentCreateBody: DepartmentCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const department = await prisma.department.create({
  //       data: departmentCreateBody,
  //     });

  //     const resBody: CreateDepartmentResponse = department;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { departmentId: string } }>(
  //   '/:departmentId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { departmentId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const departmentId = UpdateDepartmentPathParamSchema.parse(req.params.departmentId);
  //     const updateData = UpdateDepartmentRequestSchema.parse(req.body);

  //     const department = await prisma.department.findUnique({
  //       where: { id: departmentId },
  //     });

  //     if (!department) {
  //       res.status(404).send({ message: 'Department not found' });
  //       return;
  //     }

  //     const updatedDepartment = await prisma.department.update({
  //       where: { id: department.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdateDepartmentResponse = updatedDepartment;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { departmentId: string } }>(
  //   '/:departmentId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { departmentId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const departmentId = DeleteDepartmentPathParamSchema.parse(req.params.departmentId);

  //     try {
  //       await prisma.department.delete({
  //         where: { id: departmentId },
  //       });
  //       const resBody: DeleteDepartmentResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'Department',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'Department not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
