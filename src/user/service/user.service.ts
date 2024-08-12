import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/entity';
import { CreateUserInput } from '../dto/input/create-user.input';
import * as bcrypt from 'bcrypt';
import { UserResponse, UsersResponse } from '../dto/response/user.response';
import { GraphQLError } from 'graphql';
import { FilterUser } from '../dto/input/filter-user.input';
import { UpdateUserInput } from '../dto/input/update-user.input';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(input: CreateUserInput): Promise<UserResponse> {
    const { email, password } = input;
    const findUser = await this.userRepository.findOne({ where: { email } });
    if (findUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save({
      ...input,
      password: hashedPassword,
    });
    return {
      data: user,
    };
  }
  async findAllUser(filter?: FilterUser): Promise<UsersResponse> {
    const where: FindOptionsWhere<User> = {};

    try {
      if (filter && filter.isStatus !== undefined) {
        where.isStatus = filter.isStatus;
      }

      const users = await this.userRepository.find({
        where,
      });
      return {
        data: users,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof GraphQLError) {
        throw error;
      } else {
        throw new GraphQLError('Internal server error', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    }
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('UserId not found!');
    }
    return {
      data: user,
    };
  }

  async findOneByEmail(email: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    return {
      data: user,
    };
  }

  async RemoveUser(id: string) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) {
      throw new BadRequestException('UserId not found!');
    }
    findUser.isStatus = true;
    await this.userRepository.save(findUser);
    return true;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<UserResponse> {
    const findUser = await this.userRepository.findOne({ where: { id } });

    if (!findUser) {
      throw new BadRequestException('UserId not found!');
    }

    await this.userRepository.update(id, input);
    const newUser = await this.userRepository.findOne({ where: { id } });
    return {
      data: newUser,
    };
  }
}
