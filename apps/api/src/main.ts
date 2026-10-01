import { NestFactory } from "@nestjs/core";
import {AppModule} from "./app.module";
import {createDir} from "./common/utils";
import {LOGGER_DIR} from "./common/constants";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  await createDir(LOGGER_DIR);
  console.log('API is running on http://localhost:3000/api');
}
bootstrap();
