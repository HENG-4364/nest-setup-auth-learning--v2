import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/service/user.service';
import { Reflector } from '@nestjs/core';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly configService;
    private readonly userService;
    private readonly reflector;
    private readonly logger;
    constructor(jwtService: JwtService, configService: ConfigService, userService: UserService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    getRequest(context: ExecutionContext): any;
    extractTokenFromHeaders(req: Request): string;
}
