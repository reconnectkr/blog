import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ACCESS_TOKEN_LIFE_TIME, REFRESH_TOKEN_LIFE_TIME } from '../../../app';
import { LoginRequest, LoginRequestSchema, LoginResponse } from './login.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.post<{ Body: LoginRequest }>(
    '/',
    // {
    //   schema: {
    //     description: 'User login',
    //     tags: ['User'],
    //     body: {
    //       type: 'object',
    //       properties: {
    //         username: { type: 'string' },
    //         password: { type: 'string' },
    //       },
    //       required: ['username', 'password'],
    //     },
    //     response: {
    //       200: {
    //         type: 'object',
    //         properties: {
    //           accessToken: { type: 'string' },
    //           refreshToken: { type: 'string' },
    //         },
    //       },
    //     },
    //   },
    // },
    async (req: FastifyRequest<{ Body: LoginRequest }>, res: FastifyReply) => {
      const validatedBody = LoginRequestSchema.parse(req.body);

      // validateBody 가 username필드를 가지고 있는지 확인하는 typeguard 만들어줘
      if ('username' in validatedBody) {
        validatedBody.username;
      }

      const user =
        'email' in validatedBody
          ? await prisma.user.findUnique({
              where: { email: validatedBody.email },
            })
          : await prisma.user.findUnique({
              where: { username: validatedBody.username },
            });

      if (!user) {
        res.status(401).send({ message: 'Invalid email/username or password' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        validatedBody.password,
        user.password
      );

      if (!isPasswordValid) {
        res.status(401).send({ message: 'Invalid email or password' });
        return;
      }

      const accessToken = fastify.jwt.sign(
        { userId: user.id, username: user.username, role: 'user' },
        { expiresIn: ACCESS_TOKEN_LIFE_TIME } // Access token expires in 15 minutes
      );

      const refreshToken = fastify.jwt.sign(
        { userId: user.id, username: user.username, role: 'user' },
        { expiresIn: REFRESH_TOKEN_LIFE_TIME } // Refresh token expires in 7 days
      );

      // 여기서 refreshToken을 데이터베이스에 저장하는 로직을 추가할 수 있습니다.
      // 예: await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

      const resBody: LoginResponse = {
        accessToken,
        refreshToken,
      };

      res.send(resBody);
    }
  );
}
