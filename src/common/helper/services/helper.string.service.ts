import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { IHelperStringRandomOptions } from 'src/common/helper/interfaces/helper.interface';
import { IHelperStringService } from 'src/common/helper/interfaces/helper.string-service.interface';

@Injectable()
export class HelperStringService implements IHelperStringService {
  checkEmail(email: string): boolean {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }

  randomReference(length: number, prefix?: string): string {
    const timestamp = `${new Date().getTime()}`;
    const randomString: string = this.random(length, {
      safe: true,
      upperCase: true,
    });

    return prefix
      ? `${prefix}-${timestamp}${randomString}`
      : `${timestamp}${randomString}`;
  }

  random(length: number, options?: IHelperStringRandomOptions): string {
    const rString = options?.safe
      ? faker.internet.password({
          length,
          memorable: true,
          pattern: /[A-Z]/,
          prefix: options?.prefix,
        })
      : faker.internet.password({
          length,
          memorable: false,
          pattern: /\w/,
          prefix: options?.prefix,
        });

    return options?.upperCase ? rString.toUpperCase() : rString;
  }

  censor(value: string): string {
    const stringCensor = '*'.repeat(8);
    if (value.length <= 5) {
      return value;
    } else if (value.length <= 10) {
      return `${stringCensor}${value.slice(-5)}`;
    }

    return `${value.slice(0, 3)}${stringCensor}${value.slice(-5)}`;
  }

  checkPasswordWeak(password: string, length?: number): boolean {
    const regex = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z]).{${length ?? 8},}$`);

    return regex.test(password);
  }

  checkPasswordMedium(password: string, length?: number): boolean {
    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{${length ?? 8},}$`,
    );

    return regex.test(password);
  }

  checkPasswordStrong(password: string, length?: number): boolean {
    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${
        length ?? 8
      },}$`,
    );

    return regex.test(password);
  }

  checkSafeString(text: string): boolean {
    const regex = new RegExp('^[A-Za-z0-9_-]+$');
    return regex.test(text);
  }

  formatCurrency(num: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(num)
      .replace('Rp', '')
      .trim();
  }

  //custom

  generateSlug(text: string): string {
    const slug = text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
    const uniqueId = moment().add(Math.random(), 'months').unix().toString(36);
    return `${uniqueId}-${slug}`;
  }

  getShortId = () => {
    const date =
      moment().add(Math.random(), 'months').unix().toString(36) +
      moment().add(Math.random(), 'months').unix().toString(36);
    return date.toUpperCase();
  };
}
