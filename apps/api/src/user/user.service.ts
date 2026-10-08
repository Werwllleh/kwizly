import {Injectable, ConflictException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: dto
    })
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      },
    })
  }
}
