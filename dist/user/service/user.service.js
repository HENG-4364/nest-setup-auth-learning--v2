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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_1 = require("../entities/entity");
const bcrypt = require("bcrypt");
const graphql_1 = require("graphql");
let UserService = UserService_1 = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async create(input) {
        const { email, password } = input;
        const findUser = await this.userRepository.findOne({ where: { email } });
        if (findUser) {
            throw new common_1.BadRequestException('User with this email already exists');
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
    async findAllUser(filter) {
        const where = {};
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
        }
        catch (error) {
            this.logger.error(error);
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else {
                throw new graphql_1.GraphQLError('Internal server error', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
            }
        }
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.BadRequestException('UserId not found!');
        }
        return {
            data: user,
        };
    }
    async findOneByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        return {
            data: user,
        };
    }
    async RemoveUser(id) {
        const findUser = await this.userRepository.findOne({ where: { id } });
        if (!findUser) {
            throw new common_1.BadRequestException('UserId not found!');
        }
        findUser.isStatus = true;
        await this.userRepository.save(findUser);
        return true;
    }
    async updateUser(id, input) {
        const findUser = await this.userRepository.findOne({ where: { id } });
        if (!findUser) {
            throw new common_1.BadRequestException('UserId not found!');
        }
        await this.userRepository.update(id, input);
        const newUser = await this.userRepository.findOne({ where: { id } });
        return {
            data: newUser,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map