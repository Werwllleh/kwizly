import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {HealthModule} from "./health/health.module";
import { ConfigModule } from "@nestjs/config";
import {resolve} from "path";
import { z } from 'zod';
import { UserModule } from './user/user.module';
import databaseConfig from "./config/database.config";
import {LoggerMiddleware} from "./middlewares/logger.middleware";
import { AuthModule } from './auth/auth.module';
import jwtConfig from "./config/jwt.config";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";

const validationSchema = z.object({
  DATABASE_URL: z.string().min(1),
})

@Module({
  controllers: [],
  providers: [JwtAuthGuard],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [databaseConfig, jwtConfig],
      envFilePath: resolve(__dirname, '../../../.env'),
    }),
    PrismaModule,
    HealthModule,
    UserModule,
    AuthModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
