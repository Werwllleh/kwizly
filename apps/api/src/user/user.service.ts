import {Injectable, ConflictException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {
  }

  async create(dto: CreateUserDto) {
    const checkUser = await this.findOne(dto.email);
    if (checkUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.prisma.user.create({
      data: dto
    })
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
