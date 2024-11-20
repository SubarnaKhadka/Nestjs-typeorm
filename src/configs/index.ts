import AppConfig from './app.config';
import AuthConfig from './auth.config';
import BucketConfig from './bucket.config';
import AwsConfig from './aws.config';
import DatabaseConfig from './database.config';
import DebuggerConfig from './debugger.config';
import DocConfig from './doc.config';
import EmailConfig from './email.config';
import HelperConfig from './helper.config';
import MessageConfig from './message.config';
import RedisConfig from './redis.config';
import RequestConfig from './request.config';
import UserConfig from './user.config';
import smsConfig from './sms.config';

export default [
  AppConfig,
  AuthConfig,
  DatabaseConfig,
  HelperConfig,
  UserConfig,
  RequestConfig,
  DocConfig,
  DebuggerConfig,
  MessageConfig,
  EmailConfig,
  RedisConfig,
  AwsConfig,
  BucketConfig,
  smsConfig
];
