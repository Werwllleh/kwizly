import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import {AppModule} from "./app.module";
import {createDir} from "./common/utils";
import {LOGGER_DIR} from "./common/constants";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env["PORT"] || 5000);
  await createDir(LOGGER_DIR);
  console.log(`API is running on http://localhost:${process.env["PORT"] || 5000}/api`);
}
bootstrap();
