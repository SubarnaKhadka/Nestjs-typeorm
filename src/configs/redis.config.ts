import { registerAs } from '@nestjs/config';

export default registerAs(
  'redis',
  (): Record<string, any> => ({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASS,
  }),
);
