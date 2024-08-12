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
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
const graphql_2 = require("graphql");
const user_service_1 = require("../../user/service/user.service");
const public_decorator_1 = require("../decorators/public.decorator");
const core_1 = require("@nestjs/core");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard {
    constructor(jwtService, configService, userService, reflector) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
        this.reflector = reflector;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        let request;
        if (context.getType() === 'http') {
            request = context.switchToHttp().getRequest();
        }
        else {
            request = this.getRequest(context);
        }
        const token = this.extractTokenFromHeaders(request);
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
            });
            const { userId } = payload;
            const { data } = await this.userService.findOne(userId);
            request['user'] = data;
            return true;
        }
        catch (error) {
            this.logger.error(error);
            if (error instanceof graphql_2.GraphQLError) {
                throw error;
            }
            else if (error instanceof jwt_1.JsonWebTokenError) {
                throw new graphql_2.GraphQLError(error.message, {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                });
            }
            else {
                throw new graphql_2.GraphQLError(`Something went wrong`, {
                    extensions: {
                        code: 'ERROR',
                    },
                });
            }
        }
    }
    getRequest(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
    extractTokenFromHeaders(req) {
        const [type, token] = req?.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        user_service_1.UserService,
        core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map