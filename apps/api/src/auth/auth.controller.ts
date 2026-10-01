import {Body, Controller, Post, UsePipes} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ZodValidationPipe} from "../pipes/zod-validation-pipe";
import {AuthDto, authSchema} from "./dto/auth.dto";
import {CreateUserDto, createUserSchema} from "../user/dto/create-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

}
