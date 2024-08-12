import { Repository } from 'typeorm';
import { User } from '../entities/entity';
import { CreateUserInput } from '../dto/input/create-user.input';
import { UserResponse, UsersResponse } from '../dto/response/user.response';
import { FilterUser } from '../dto/input/filter-user.input';
import { UpdateUserInput } from '../dto/input/update-user.input';
export declare class UserService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>);
    create(input: CreateUserInput): Promise<UserResponse>;
    findAllUser(filter?: FilterUser): Promise<UsersResponse>;
    findOne(id: string): Promise<UserResponse>;
    findOneByEmail(email: string): Promise<UserResponse>;
    RemoveUser(id: string): Promise<boolean>;
    updateUser(id: string, input: UpdateUserInput): Promise<UserResponse>;
}
