import {
  ENUM_HELPER_DATE_DIFF,
  ENUM_HELPER_DATE_FORMAT,
  ENUM_HELPER_FILE_TYPE,
} from 'src/common/helper/constants/helper.enum.constant';

// Helper Encryption
export interface IHelperJwtVerifyOptions {
  audience: string;
  issuer: string;
  subject: string;
  secretKey: string;
  ignoreExpiration?: boolean;
}

export interface IHelperJwtOptions
  extends Omit<IHelperJwtVerifyOptions, 'ignoreExpiration'> {
  expiredIn: number | string;
  notBefore?: number | string;
}

// Helper String
export interface IHelperStringRandomOptions {
  upperCase?: boolean;
  safe?: boolean;
  prefix?: string;
}

// Helper Date
export interface IHelperDateStartAndEnd {
  month?: number;
  year?: number;
}

export interface IHelperDateStartAndEndDate {
  startDate: Date;
  endDate: Date;
}

export interface IHelperDateExtractDate {
  date: Date;
  day: string;
  month: string;
  year: string;
}

export interface IHelperDateOptionsDiff {
  format?: ENUM_HELPER_DATE_DIFF;
}

export interface IHelperDateOptionsCreate {
  startOfDay?: boolean;
}

export interface IHelperDateOptionsFormat {
  format?: ENUM_HELPER_DATE_FORMAT | string;
}

export interface IHelperDateOptionsForward {
  fromDate?: Date;
}

export type IHelperDateOptionsBackward = IHelperDateOptionsForward;

export interface IHelperDateOptionsRoundDown {
  hour: boolean;
  minute: boolean;
  second: boolean;
}

// Helper File

export type IHelperFileRows = Record<string, string | number | Date>;

export interface IHelperFileWriteExcelOptions {
  password?: string;
  type?: ENUM_HELPER_FILE_TYPE;
}

export interface IHelperFileCreateExcelWorkbookOptions {
  sheetName?: string;
}

export interface IHelperFileReadExcelOptions {
  sheet?: string | number;
  password?: string;
}

// helper google

export interface IHelperGooglePayload {
  email: string;
}

export interface IHelperGoogleRefresh {
  accessToken: string;
}
