import { ExecutionContext } from '@nestjs/common';
import { UserResponse } from 'src/user/dto/response/user.response';
export declare const getMeByContext: (context: ExecutionContext) => UserResponse;
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
