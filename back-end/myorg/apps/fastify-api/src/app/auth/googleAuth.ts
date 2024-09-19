import axios from 'axios';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { ACCESS_TOKEN_LIFE_TIME, REFRESH_TOKEN_LIFE_TIME } from '../app';

interface GoogleAuthPluginOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

async function googleAuthPlugin(
  fastify: FastifyInstance,
  options: GoogleAuthPluginOptions
) {
  const { clientId, clientSecret, redirectUri } = options;

  fastify.get('/auth/google', async (request, reply) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
    reply.redirect(authUrl);
  });

  fastify.get('/auth/google/callback', async (request, reply) => {
    const { code } = request.query as { code: string };

    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }
      );

      const { access_token } = tokenResponse.data;

      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const userInfo = userInfoResponse.data;
      console.log(userInfo);

      // 여기서 사용자 정보를 저장하거나 세션을 생성할 수 있습니다.
      // 예: request.session.user = userInfo

      // 사용자 데이터베이스에 사용자 정보 저장
      const prisma = fastify.prisma;
      let user = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userInfo.email,
            username: userInfo.name, // 또는 다른 필드 사용
            password: '', // Google 인증이므로 비밀번호는 필요 없음
          },
        });

        await prisma.profile.create({
          data: {
            userId: user.id,
            name: userInfo.name,
          },
        });
      }

      // accessToken 및 refreshToken 생성
      const accessToken = fastify.jwt.sign(
        { userId: user.id, username: user.username, role: 'user' },
        { expiresIn: ACCESS_TOKEN_LIFE_TIME }
      );

      const refreshToken = fastify.jwt.sign(
        { userId: user.id, username: user.username, role: 'user' },
        { expiresIn: REFRESH_TOKEN_LIFE_TIME }
      );

      // refreshToken을 데이터베이스에 저장하는 로직 추가
      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: { refreshToken },
      // });

      // 토큰을 세션에 저장하여 redirection후에 client가 사용할수 있도록 한다.
      // request.session.accessToken = accessToken;
      // request.session.refreshToken = refreshToken;

      // reply.redirect('/');
      reply.send({ accessToken, refreshToken });
    } catch (error) {
      reply.code(500).send({ error: 'Authentication failed' });
    }
  });
}

export default fp(googleAuthPlugin);
