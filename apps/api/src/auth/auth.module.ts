import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtAuthGuard],
  exports: [
    AuthService,
    JwtModule,
    JwtAuthGuard
  ],
})
export class AuthModule {}
