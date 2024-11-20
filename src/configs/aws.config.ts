import { registerAs } from '@nestjs/config';

export default registerAs(
  'aws',
  (): Record<string, any> => ({
    key: process.env.AWS_CREDENTIAL_KEY,
    secret: process.env.AWS_CREDENTIAL_SECRET,
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION,
    baseUrl: process.env.AWS_BASE_URL,
  }),
);
