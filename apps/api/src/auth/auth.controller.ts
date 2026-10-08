import {Body, Controller, Get, Post, UseGuards, UsePipes} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ZodValidationPipe} from "../pipes/zod-validation-pipe";
import {AuthDto, authSchema} from "./dto/auth.dto";
import {CreateUserDto, createUserSchema} from "../user/dto/create-user.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {CurrentUser} from "../common/decorators/current-user.decorator";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(authSchema))
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  @Post('/register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto)
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: {email: string}) {
    return this.authService.me(user.email);
  }

}
