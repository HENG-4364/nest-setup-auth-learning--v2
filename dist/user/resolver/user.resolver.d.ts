import { UserService } from '../service/user.service';
import { UserResponse, UsersResponse } from '../dto/response/user.response';
import { CreateUserInput } from '../dto/input/create-user.input';
import { FilterUser } from '../dto/input/filter-user.input';
import { UpdateUserInput } from '../dto/input/update-user.input';
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    create(input: CreateUserInput): Promise<UserResponse>;
    users(filter: FilterUser): Promise<UsersResponse>;
    user(id: string): Promise<UserResponse>;
    removeUser(id: string): Promise<boolean>;
    updateUser(id: string, input: UpdateUserInput): Promise<UserResponse>;
}
