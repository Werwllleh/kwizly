import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {HealthModule} from "./health/health.module";
import { ConfigModule } from "@nestjs/config";
import {resolve} from "path";
import { z } from 'zod';
import { UserModule } from './user/user.module';
import databaseConfig from "./config/database.config";

const validationSchema = z.object({
  DATABASE_URL: z.string().min(1),
})

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [databaseConfig],
      envFilePath: resolve(__dirname, '../../../.env'),
    }),
    PrismaModule,
    HealthModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
