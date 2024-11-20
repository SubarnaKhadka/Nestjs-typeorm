export enum OTP_TYPE {
    REGISTER = 'REGISTER',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',

}
export interface IOtp {
    expiryDate: Date;
    otp: string;
    otpType: OTP_TYPE;
    userId: number;
}