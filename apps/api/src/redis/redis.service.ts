import {Injectable, Logger, OnModuleDestroy} from "@nestjs/common";
import {Redis} from "ioredis";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RedisService implements OnModuleDestroy {

  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<number>('REDIS_PORT', 26379));

    this.client = new Redis({
      host,
      port,
      maxRetriesPerRequest: 3
    })

    this.client.on('connect', () => {
      this.logger.log(`Подключение к Redis успешно (${host}:${port})`);
    })

    this.client.on('error', (err) => {
      this.logger.log('Ошибка Redis соединения:', err);
    })
  }

  async onModuleDestroy() {
    this.logger.log('Закрытие соединения с Redis ...')
    await this.client.quit()
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  get rawClient(): Redis {
    return this.client;
  }

}
