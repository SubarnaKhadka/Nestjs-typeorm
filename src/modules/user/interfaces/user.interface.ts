export enum USER_TYPE {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
    VENDOR = 'VENDOR',
}
export interface IUser {
    name: IUserNameJson;
    password?: string;
    passwordLastChangedAt?: Date;
    previousPassword?: string;
    passwordWrongAttempt?: number;
    email?: string;
    phone?: string;
    emailVerifiedAt?: Date | null;
    phoneVerifiedAt?: Date | null;
    countryCode?: string;
    addressId?: number | null;
    isActive?: boolean;
    type?: USER_TYPE;
    vendorId?: number | null;
    vendorRoleId?: number;
    roleId?: number;
    gender?: string;
    dob?: Date;
}

export interface IUserNameJson {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
}

export enum USER_GENDER {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHERS = 'OTHERS',
}
