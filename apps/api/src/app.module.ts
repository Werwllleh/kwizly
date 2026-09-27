import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {HealthModule} from "./health/health.module";
import { ConfigModule } from "@nestjs/config";
import {resolve} from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '../../../.env'),
    }),
    PrismaModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
