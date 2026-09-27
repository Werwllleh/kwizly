import {Injectable, OnModuleInit, OnModuleDestroy, Logger} from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const dbUrl = configService.getOrThrow<string>('database.url')
    const adapter = new PrismaPg({ connectionString: dbUrl });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from database');
  }
}
