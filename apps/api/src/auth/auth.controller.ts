import {Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from "./auth.service";
import {ZodValidationPipe} from "../pipes/zod-validation-pipe";
import {AuthDto, authSchema} from "./dto/auth.dto";
import {CreateUserDto, createUserSchema} from "../user/dto/create-user.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {CurrentUser} from "../common/decorators/current-user.decorator";
import {SessionService} from "./session.service";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private sessionService: SessionService) {
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(authSchema))
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Post('/register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.register(dto);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { email: string }) {
    return this.authService.me(user.email);
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') bodyToken?: string
  ) {
    const refreshToken = req.cookies?.refreshToken || bodyToken;
    const tokens = await this.sessionService.updateRefreshToken(refreshToken);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') bodyToken?: string
  ): Promise<{ success: boolean }> {
    const refreshToken = req.cookies?.refreshToken || bodyToken;
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
    });
    if (!refreshToken) {
      return { success: true };
    }
    return this.sessionService.logout(refreshToken);
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }

}
