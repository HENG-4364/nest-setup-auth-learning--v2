"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const disabled_1 = require("@apollo/server/plugin/disabled");
const path_1 = require("path");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    type: 'mysql',
                    host: configService.getOrThrow('DATABASE_HOST'),
                    port: configService.getOrThrow('DATABASE_PORT'),
                    username: configService.getOrThrow('DATABASE_USER'),
                    password: configService.getOrThrow('DATABASE_PASSWORD'),
                    database: configService.getOrThrow('DATABASE_NAME'),
                    autoLoadEntities: true,
                    synchronize: true,
                    migrationsRun: true,
                    migrationsTableName: 'migrations',
                    charset: 'utf8mb4',
                }),
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                playground: false,
                plugins: [
                    process.env.NODE_ENV === 'development'
                        ? (0, default_1.ApolloServerPluginLandingPageLocalDefault)()
                        : (0, disabled_1.ApolloServerPluginLandingPageDisabled)(),
                ],
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map