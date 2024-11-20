import { registerAs } from '@nestjs/config';

export default registerAs(
    'sms',
    (): Record<string, any> => ({
        infobip_base: process.env?.INFOBIP_SMS_BASE_URL,
        infobip_token: process.env?.INFOBIP_TOKEN,
    }),
);
