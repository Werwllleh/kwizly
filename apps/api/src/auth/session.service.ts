import {TSessionTokens} from "../common/types";
import {HttpException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {createToken, hashToken} from "../common/utils";
import {SessionModel} from "../generated/prisma/models/Session";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {UserModel} from "../generated/prisma/models/User";



@Injectable()
export class SessionService {

  constructor(private prisma: PrismaService,
              private jwtService: JwtService,
              private userService: UserService) {}

  async updateRefreshToken(refreshToken: string): Promise<TSessionTokens> {

    const session = await this.getUserSession(refreshToken);

    if (!session) {
      throw new UnauthorizedException({message: 'Сессия не найдена'})
    }

    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({
        where: {
          id: session.id
        }
      })
      throw new UnauthorizedException({message: 'Токен авторизации устарел'})
    }

    const tokens = await this.generateTokensAndSession(session.userId)

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        hashedToken: hashToken(tokens.refresh_token),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    return tokens;
  }

  async createSession(userId: string): Promise<TSessionTokens> {

    const tokens = await this.generateTokensAndSession(userId)

    await this.prisma.session.create({
      data: {
        userId: userId,
        hashedToken: hashToken(tokens.refresh_token),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return tokens;
  }

  async logout(refreshToken: string): Promise<SessionModel | null> {

    const session = await this.getUserSession(refreshToken);

    if (!session) {
      return null
    }

    return await this.prisma.session.delete({
      where: {
        id: session.id
      }
    })
  }

  private async getUserSession(refreshToken: string): Promise<SessionModel | null> {
    return await this.prisma.session.findFirst({
      where: {
        hashedToken: hashToken(refreshToken)
      }
    })
  }

  private generateAccessToken(user: UserModel): string {

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    return this.jwtService.sign(payload, { expiresIn: '15m' })
  }

  private async generateTokensAndSession(userId: string): Promise<TSessionTokens> {

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }

    const rawAccessToken = this.generateAccessToken(user);
    const rawRefreshToken = createToken();

    return {
      access_token:  rawAccessToken,
      refresh_token: rawRefreshToken,
    }
  }

}
