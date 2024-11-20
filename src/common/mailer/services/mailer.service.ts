import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: configService.get<string>('mail.service'),
      host: configService.get<string>('mail.host'),
      port: configService.get<string>('mail.port'),
      secure: false,
      auth: {
        user: configService.get<string>('mail.email'),
        pass: configService.get<string>('mail.pass'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const obj = {
      from:
        this.configService.get<string>('mail.sender') +
        '<' +
        this.configService.get<string>('mail.email') +
        '>',
      to: to,
      subject: subject,
      text: text,
      html: `<b>${text}</b>`,
    };
    await this.transporter.sendMail(obj);
  }

  async sendMailUsingInfobip(subject?: string, to?: string, message?: string) {
    const url = this.configService.get<string>('email.infobip_base');
    if (!url) throw 'Cannot find url';

    const authToken = this.configService.get<string>('email.infobip_token');

    const senderEmail = this.configService.get<string>(
      'email.infobip_sender_email',
    );

    const body = new FormData();
    body.append('from', senderEmail);
    body.append('subject', subject);
    body.append('to', to);
    body.append('text', message);

    const headers = {
      Authorization: `App ${authToken}`,
      'Content-Type': 'multipart/form-data',
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
}
