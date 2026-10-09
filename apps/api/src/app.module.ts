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
import { QuizModule } from './quiz/quiz.module';

const validationSchema = z.object({
  DATABASE_URL: z.string().min(1),
})

@Module({
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
    QuizModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
