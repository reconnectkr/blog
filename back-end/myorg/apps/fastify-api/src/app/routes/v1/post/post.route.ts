import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GetPostPathParamSchema, GetPostResponse } from './get-post.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get<{ Params: { postId: string } }>(
    '/:postId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { postId: string } }>,
      res: FastifyReply
    ) => {
      const postId = GetPostPathParamSchema.parse(req.params.postId);
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!post) {
        res.status(404).send({ message: 'Post not found' });
        return;
      }

      const resBody: GetPostResponse = {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        categories: post.categories.map((categoryOnpost) => ({
          id: categoryOnpost.category.id,
          name: categoryOnpost.category.name,
        })),
      };
      res.send(resBody);
    }
  );

  // fastify.get(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedQueryString = ListPostQueryStringSchema.parse(
  //       req.query
  //     );
  //     const { filter, orderBy } = validatedQueryString;
  //     const page = validatedQueryString.page ?? 1;
  //     const pageSize: number =
  //       validatedQueryString.pageSize !== undefined
  //         ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
  //         : PAGE_SIZE_DEFAULT;
  //     const posts = await prisma.post.findMany({
  //       where: filter,
  //       skip: (page - 1) * pageSize,
  //       take: pageSize,
  //       orderBy: orderBy,
  //       include: {
  //         inventoryUnit: {
  //           select: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //         category: {
  //           select: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //       },
  //     });

  //     const resBody: ListPostResponse = {
  //       items: posts,
  //     };
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { postId: string } }>(
  //   '/:postId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { postId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const postId = DeletePostPathParamSchema.parse(
  //       req.params.postId
  //     );

  //     try {
  //       await prisma.post.delete({
  //         where: { id: postId },
  //       });
  //       const resBody: DeletePostResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'Post',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'Post not found' });
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
  //     const validatedBody = CreatePostRequestSchema.parse(req.body);

  //     type PostCreateBody = Prisma.Args<
  //       typeof prisma.post,
  //       'create'
  //     >['data'];

  //     const postCreateBody: PostCreateBody = {
  //       ...validatedBody,
  //       createdBy: req.user.userId,
  //       updatedBy: req.user.userId,
  //     };

  //     const post = await prisma.post.create({
  //       data: postCreateBody,
  //     });

  //     const resBody: CreatePostResponse = post;
  //     res.status(201).send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { postId: number } }>(
  //   '/:postId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { postId: number } }>,
  //     res: FastifyReply
  //   ) => {
  //     const postId = UpdatePostPathParamSchema.parse(
  //       req.params.postId
  //     );
  //     const validatedBody = UpdatePostRequestSchema.parse(req.body);
  //     try {
  //       const updatedPost = await prisma.post.update({
  //         where: { id: postId },
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

  //       const resBody: UpdatePostResponse = updatedPost;
  //       res.send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'Post not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
