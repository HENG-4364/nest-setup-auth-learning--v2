export declare class LoginResponse {
    accessToken: string;
    refreshToken: string;
}
declare const RefreshTokenResponse_base: import("@nestjs/common").Type<Partial<LoginResponse>>;
export declare class RefreshTokenResponse extends RefreshTokenResponse_base {
}
export {};
