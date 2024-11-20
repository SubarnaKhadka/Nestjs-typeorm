import { registerAs } from '@nestjs/config';

export default registerAs(
  'email',
  (): Record<string, any> => ({
    infobip_base: process.env.INFOBIP_EMAIL_BASE_URL,
    infobip_token: process.env?.INFOBIP_TOKEN,
    infobip_sender_email: process.env?.INFOBIP_SENDER_EMAIL
  }),
);
