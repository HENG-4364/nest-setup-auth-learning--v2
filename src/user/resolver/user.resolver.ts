import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../service/user.service';
import { UserResponse, UsersResponse } from '../dto/response/user.response';
import { CreateUserInput } from '../dto/input/create-user.input';
import { FilterUser } from '../dto/input/filter-user.input';
import { UpdateUserInput } from '../dto/input/update-user.input';
import { Public } from 'src/auth/decorators/public.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Mutation(() => UserResponse)
  async create(@Args('input') input: CreateUserInput) {
    return await this.userService.create(input);
  }

  @Public()
  @Query(() => UsersResponse)
  async users(@Args('filter', { nullable: true }) filter: FilterUser) {
    return await this.userService.findAllUser(filter);
  }

  @Query(() => UserResponse)
  async user(@Args('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: string) {
    return await this.userService.RemoveUser(id);
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserResponse> {
    return await this.userService.updateUser(id, input);
  }
}
