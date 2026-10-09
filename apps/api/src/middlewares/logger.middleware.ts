import {Injectable, NestMiddleware} from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import {writeLog} from "../common/utils";



@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const start = Date.now();
    const date = new Date();

    res.on('finish', async () => {
      try {
        const duration = Date.now() - start;

        const info = {
          url: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode,
          duration,
        };

        await writeLog(date, info);
      } catch (error) {
        console.error('Failed to write access log:', error);
      }
    });

    next();
  }
}
