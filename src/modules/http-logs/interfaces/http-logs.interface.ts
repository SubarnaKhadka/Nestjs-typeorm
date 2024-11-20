export interface IHttpLogs {
  remoteAddress: string | null;
  remoteUserId: number | null;
  url: string | null;
  queryParams: Record<string, any>;
  params: Record<string, any>;
  userAgent: string | null;
  hostname: string;
  responseCode: number;
  responseTime: number;
  method: string;
  timezone: string;
  timestamp: number;
  metadata: Record<string, any>;
}
