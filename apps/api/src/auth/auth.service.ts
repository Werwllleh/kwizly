import {ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthDto} from "./dto/auth.dto";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcryptjs";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {TSessionTokens, TUser} from "../common/types";
import {SessionService} from "./session.service";

@Injectable()
export class AuthService {

  constructor(private userService: UserService, private sessionService: SessionService) {
  }

  async login(dto: AuthDto): Promise<TSessionTokens> {
    const user = await this.validateUser(dto);
    return this.sessionService.createSession(user.id);
  }

  async register(dto: CreateUserDto): Promise<TSessionTokens> {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
    }

    const hashedPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.create({...dto, password: hashedPassword})

    return this.sessionService.createSession(user.id);
  }

  async me(email: string): Promise<{ user: TUser | null }> {

    const data = await this.userService.getUserByEmail(email);

    return {
      user: data
    }
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new ConflictException('Пользователь с таким email не существует');
    }

    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({message: "Некорректный email или пароль"})
  }
}
