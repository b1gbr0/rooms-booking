/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body } = req;
    const start = Date.now();

    const chunks: Buffer[] = [];
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = ((...args: any[]) => {
      const chunk =
        typeof args[0] === 'string' || args[0] instanceof Buffer
          ? Buffer.from(args[0])
          : Buffer.from(JSON.stringify(args[0]));
      chunks.push(chunk);
      return originalWrite(...args);
    }) as typeof res.write;

    res.end = ((...args: any[]) => {
      if (args[0]) {
        const chunk =
          typeof args[0] === 'string' || args[0] instanceof Buffer
            ? Buffer.from(args[0])
            : Buffer.from(JSON.stringify(args[0]));
        chunks.push(chunk);
      }
      return originalEnd(...args);
    }) as typeof res.end;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const responseBody = Buffer.concat(chunks).toString('utf8');

      let log = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

      const sanitizedBody = sanitizeBody(body);
      if (Object.keys(body || {}).length > 0) {
        log += `\n  Request body: ${JSON.stringify(sanitizedBody)}`;
      }

      if (statusCode >= 400) {
        log += `\n  Response error: ${responseBody}`;
        this.logger.error(log);
      } else {
        this.logger.log(log);
      }
    });

    next();
  }
}

function sanitizeBody(input: any, keysToMask = ['password']): any {
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeBody(item, keysToMask));
  } else if (input && typeof input === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      if (keysToMask.includes(key.toLowerCase())) {
        result[key] = '*****';
      } else {
        result[key] = sanitizeBody(value, keysToMask);
      }
    }
    return result;
  }
  return input;
}
