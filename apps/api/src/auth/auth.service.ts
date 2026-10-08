import {ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthDto} from "./dto/auth.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserModel} from "../generated/prisma/models/User";
import {TUser} from "../common/types";

@Injectable()
export class AuthService {

  constructor(private userService: UserService, private jwtService: JwtService) {
  }

  async login(dto: AuthDto): Promise<{ token: string }> {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async register(dto: CreateUserDto): Promise<{ token: string }> {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
    }

    const hashedPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.create({...dto, password: hashedPassword})

    return this.generateToken(user);
  }

  async me(email: string): Promise<{ user: TUser | null }> {

    const data = await this.userService.getUserByEmail(email);

    return {
      user: data
    }
  }

  private async generateToken(user: UserModel) {

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    return {
      token: this.jwtService.sign(payload),
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
