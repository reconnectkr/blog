import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import googleAuthPlugin from '../auth/googleAuth';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socialLoginPlugin: FastifyPluginAsync = fp(async (server, options) => {
  server.register(googleAuthPlugin, {
    clientId: process.env.GOOGLE_CLIENT_ID || 'google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:3000/auth/google/callback',
  });
});

export default socialLoginPlugin;
