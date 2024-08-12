"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/service/user.service");
const graphql_1 = require("graphql");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = AuthService_1 = class AuthService {
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async Login(input) {
        const findUser = await this.userService.findOneByEmail(input.email);
        if (!findUser?.data) {
            throw new graphql_1.GraphQLError(`Email does not exist`, {
                extensions: {
                    code: 'NOT_FOUND',
                },
            });
        }
        const isMatched = bcrypt.compareSync(input.password, findUser.data.password);
        if (!isMatched) {
            throw new graphql_1.GraphQLError(`incorrect password`, {
                extensions: {
                    code: 'INCORRECT_PASSWORD',
                },
            });
        }
        const { data } = findUser;
        const refreshPayload = { userId: data.id };
        const accesPayload = { userId: data.id };
        const accessToken = await this.jwtService.signAsync(accesPayload, {
            expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXP'),
            secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
        });
        const refreshToken = this.jwtService.sign(refreshPayload, {
            expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXP'),
            secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async RefreshToken(input) {
        try {
            const payload = await this.jwtService.verifyAsync(input.refreshToken, {
                secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
            });
            const { userId } = payload;
            const refreshPayload = { userId };
            const accesPayload = { userId };
            const accessToken = await this.jwtService.signAsync(accesPayload, {
                expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXP'),
                secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
            });
            const refreshToken = this.jwtService.sign(refreshPayload, {
                expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXP'),
                secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
            });
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            this.logger.error(error);
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof jwt_1.JsonWebTokenError) {
                throw new graphql_1.GraphQLError(error.message, {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                });
            }
            else {
                throw new graphql_1.GraphQLError('Internal Server Error', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map