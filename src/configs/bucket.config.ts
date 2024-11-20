import { registerAs } from '@nestjs/config';

export default registerAs(
  'bucket',
  (): Record<string, any> => ({
    admin: process.env.AWS_S3_BUCKET,
    operators: process.env.AWS_S3_BUCKET,
    customers: process.env.AWS_S3_BUCKET,
  }),
);
