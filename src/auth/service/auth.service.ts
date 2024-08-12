import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { LoginInput } from '../dto/input/login.input';
import { LoginResponse } from '../dto/response/login.reponse';
import { GraphQLError } from 'graphql';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenInput } from '../dto/input/refresh-token.input';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async Login(input: LoginInput): Promise<LoginResponse> {
    const findUser = await this.userService.findOneByEmail(input.email);

    if (!findUser?.data) {
      throw new GraphQLError(`Email does not exist`, {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    const isMatched = bcrypt.compareSync(
      input.password,
      findUser.data.password,
    );
    if (!isMatched) {
      throw new GraphQLError(`incorrect password`, {
        extensions: {
          code: 'INCORRECT_PASSWORD',
        },
      });
    }
    const { data } = findUser;

    const refreshPayload = { userId: data.id };
    const accesPayload = { userId: data.id };
    const accessToken = await this.jwtService.signAsync(accesPayload, {
      expiresIn: this.configService.getOrThrow<string>('ACCESS_TOKEN_EXP'),
      secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: this.configService.getOrThrow<string>('REFRESH_TOKEN_EXP'),
      secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async RefreshToken(input: RefreshTokenInput) {
    try {
      const payload = await this.jwtService.verifyAsync(input.refreshToken, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });

      const { userId } = payload;
      const refreshPayload = { userId };
      const accesPayload = { userId };
      const accessToken = await this.jwtService.signAsync(accesPayload, {
        expiresIn: this.configService.getOrThrow<string>('ACCESS_TOKEN_EXP'),
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      });

      const refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.getOrThrow<string>('REFRESH_TOKEN_EXP'),
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof GraphQLError) {
        throw error;
      } else if (error instanceof JsonWebTokenError) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      } else {
        throw new GraphQLError('Internal Server Error', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    }
  }
}
