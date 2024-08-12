import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../service/auth.service';
import {
  LoginResponse,
  RefreshTokenResponse,
} from '../dto/response/login.reponse';
import { LoginInput } from '../dto/input/login.input';
import { UserResponse } from 'src/user/dto/response/user.response';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { MeResponse } from '../dto/response/me.response';
import { RefreshTokenInput } from '../dto/input/refresh-token.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.Login(input);
  }

  @Query(() => MeResponse)
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: UserResponse) {
    return user;
  }

  @Public()
  @Mutation(() => RefreshTokenResponse)
  async refreshToken(@Args('input') input: RefreshTokenInput) {
    return await this.authService.RefreshToken(input);
  }
}
