import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async sendSmsUsingInfobip(
    to: string,
    message: string,
  ): Promise<AxiosResponse<any[]> | any> {
    const url = this.configService.get<string>('sms.infobip_base');
    if (!url) throw 'Cannot find url';

    const authToken = this.configService.get<string>('sms.infobip_token');

    const body = JSON.stringify({
      messages: [
        {
          destinations: [{ to: to }],
          from: 'ServiceSMS',
          text: message,
        },
      ],
    });

    const headers = {
      Authorization: `App ${authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    return await firstValueFrom(
      this.httpService
        .post(url, body, {
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error?.response?.data);
            throw 'An error happened!';
          }),
        ),
    );
  }

  async sendSMSUsingSparrow(
    to: string,
    message: string,
  ): Promise<AxiosResponse<any[]> | any> {
    const url = this.configService.get<string>('sms.sparrow_base');
    if (!url) throw 'Cannot find url';
    return await firstValueFrom(
      this.httpService.post(url, {
        token: this.configService.get<string>('sms.sparrow_token'),
        from: this.configService.get<string>('sms.sparrow_sender'),
        to: to,
        text: message,
      }),
    );
  }

  sendSMSUsingAakash(
    to: string,
    message: string,
  ): Observable<AxiosResponse<any[]>> {
    const url = this.configService.get<string>('sms.aakash_base');
    if (!url) throw 'Cannot find url';
    return this.httpService
      .post(url, {
        auth_token: this.configService.get<string>('sms.aakash_token'),
        to: to,
        text: message,
      })
      .pipe(
        catchError((error: AxiosError) => {
          console.log(error?.response?.data);
          throw 'An error happened!';
        }),
      );
  }
}
