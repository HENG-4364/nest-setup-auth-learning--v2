import { UserService } from 'src/user/service/user.service';
import { LoginInput } from '../dto/input/login.input';
import { LoginResponse } from '../dto/response/login.reponse';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenInput } from '../dto/input/refresh-token.input';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    Login(input: LoginInput): Promise<LoginResponse>;
    RefreshToken(input: RefreshTokenInput): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
