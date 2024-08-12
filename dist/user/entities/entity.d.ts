import { BaseEntity } from 'src/common/entities/base.entity';
export declare class User extends BaseEntity {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    password: string;
    isStatus: boolean;
}
