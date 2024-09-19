import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GetPostPathParamSchema, GetPostResponse } from './get-post.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get<{ Params: { slug: string } }>(
    '/:slug',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { slug: string } }>,
      res: FastifyReply
    ) => {
      const slug = GetPostPathParamSchema.parse(req.params.slug);
      const post = await prisma.post.findUnique({
        where: { slug },
      });

      if (!post) {
        res.status(404).send({ message: 'Post not found' });
        return;
      }

      const categories = await prisma.categoriesOnPosts.findMany({
        where: {
          postId: post.id,
        },
        include: {
          category: true,
        },
      });

      const resBody: GetPostResponse = {
        ...post,
        categories: categories.map((category) => ({
          id: category.category.id,
          name: category.category.name,
        })),
      };
      res.send(resBody);
    }
  );

  // fastify.get(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedQueryString = ListPostQueryStringSchema.parse(req.query);
  //     const { filter, orderBy } = validatedQueryString;
  //     const page = validatedQueryString.page ?? 1;
  //     const pageSize: number =
  //       validatedQueryString.pageSize !== undefined
  //         ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
  //         : PAGE_SIZE_DEFAULT;
  //     const Posts = await prisma.Post.findMany({
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
  //       items: Posts,
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
  //     const postId = DeletePostPathParamSchema.parse(req.params.postId);

  //     try {
  //       await prisma.Post.delete({
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

  //     type PostCreateBody = Prisma.Args<typeof prisma.Post, 'create'>['data'];

  //     const PostCreateBody: PostCreateBody = {
  //       ...validatedBody,
  //       createdBy: req.user.userId,
  //       updatedBy: req.user.userId,
  //     };

  //     const Post = await prisma.Post.create({
  //       data: PostCreateBody,
  //     });

  //     const resBody: CreatePostResponse = Post;
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
  //     const postId = UpdatePostPathParamSchema.parse(req.params.postId);
  //     const validatedBody = UpdatePostRequestSchema.parse(req.body);
  //     try {
  //       const updatedPost = await prisma.Post.update({
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
