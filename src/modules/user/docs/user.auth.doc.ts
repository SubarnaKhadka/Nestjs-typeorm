// import { applyDecorators } from '@nestjs/common';
// import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/interfaces/doc.interface';
// import { LoginDto } from 'src/modules/authentication/dtos/login.dto';
// import { UserLoginSerialization } from '../serializations/user.login.serialization';

// export function UserAuthLoginDoc(): MethodDecorator {
//     return applyDecorators(
//         Doc({
//             summary: 'login with email and password',
//         }),
//         DocRequest({
//             bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
//             body: LoginDto,
//         }),
//         DocAuth({ apiKey: true }),
//         DocResponse<UserLoginSerialization>('user.login', {
//             serialization: UserLoginSerialization,
//         }),
//     );
// }

// // export function UserAuthLoginGoogleDoc(): MethodDecorator {
// //     return applyDecorators(
// //         Doc({
// //             summary: 'login with access token google',
// //         }),
// //         DocAuth({ google: true, apiKey: true }),
// //         DocResponse('user.loginGoogle'),
// //     );
// // }

// // export function UserAuthRefreshDoc(): MethodDecorator {
// //     return applyDecorators(
// //         Doc({
// //             summary: 'refresh a token',
// //         }),
// //         DocAuth({ apiKey: true, jwtRefreshToken: true }),
// //         DocResponse<UserRefreshSerialization>('user.refresh', {
// //             serialization: UserRefreshSerialization,
// //         }),
// //     );
// // }

// // export function UserAuthProfileDoc(): MethodDecorator {
// //     return applyDecorators(
// //         Doc({
// //             summary: 'get profile',
// //         }),
// //         DocAuth({
// //             apiKey: true,
// //             jwtAccessToken: true,
// //         }),
// //         DocResponse<UserProfileSerialization>('user.profile', {
// //             serialization: UserProfileSerialization,
// //         }),
// //     );
// // }

// // export function UserAuthUpdateProfileDoc(): MethodDecorator {
// //     return applyDecorators(
// //         Doc({
// //             summary: 'update profile',
// //         }),
// //         DocAuth({
// //             apiKey: true,
// //             jwtAccessToken: true,
// //         }),
// //         DocRequest({
// //             bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
// //             body: UserUpdateNameDto,
// //         }),
// //         DocResponse('user.updateProfile'),
// //     );
// // }

// // export function UserAuthInfoDoc(): MethodDecorator {
// //     return applyDecorators(
// //         Doc({
// //             summary: 'get info of access token',
// //         }),
// //         DocAuth({
// //             apiKey: true,
// //             jwtAccessToken: true,
// //         }),
// //         DocResponse<AuthAccessPayloadSerialization>('user.info', {
// //             serialization: AuthAccessPayloadSerialization,
// //         }),
// //     );
// // }

// // export function UserAuthChangePasswordDoc(): MethodDecorator {
// //     return applyDecorators(
// //         Doc({
// //             summary: 'change password',
// //         }),
// //         DocAuth({
// //             apiKey: true,
// //             jwtAccessToken: true,
// //         }),
// //         DocRequest({
// //             bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
// //             body: UserChangePasswordDto,
// //         }),
// //         DocResponse('user.changePassword'),
// //     );
// // }

// // export function UserAuthClaimUsernameDoc(): MethodDecorator {
// //     return applyDecorators(
// //         Doc({
// //             summary: 'claim username',
// //         }),
// //         DocAuth({
// //             apiKey: true,
// //             jwtAccessToken: true,
// //         }),
// //         DocRequest({
// //             bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
// //             body: UserUpdateUsernameDto,
// //         }),
// //         DocResponse('user.claimUsername'),
// //     );
// // }
