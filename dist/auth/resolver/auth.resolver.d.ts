import { AuthService } from '../service/auth.service';
import { LoginResponse } from '../dto/response/login.reponse';
import { LoginInput } from '../dto/input/login.input';
import { UserResponse } from 'src/user/dto/response/user.response';
import { RefreshTokenInput } from '../dto/input/refresh-token.input';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    login(input: LoginInput): Promise<LoginResponse>;
    getMe(user: UserResponse): Promise<UserResponse>;
    refreshToken(input: RefreshTokenInput): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
