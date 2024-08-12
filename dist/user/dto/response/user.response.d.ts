export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    password: string;
    isStatus: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare class UsersResponse {
    data: User[];
}
export declare class UserResponse {
    data: User;
}
