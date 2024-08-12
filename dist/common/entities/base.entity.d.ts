import { BaseEntity as _BaseEntity } from 'typeorm';
export declare abstract class BaseEntity extends _BaseEntity {
    id: string;
    created_at: Date;
    updated_at: Date;
}
