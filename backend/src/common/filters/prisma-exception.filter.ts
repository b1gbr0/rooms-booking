import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const code = exception.code;
      const meta = exception.meta;

      switch (code) {
        case 'P2002': // Unique constraint failed
          return response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: `Field "${(meta?.target as string[]).join(', ')}" must be unique.`,
            path: request.url,
          });

        case 'P2003': // Foreign key constraint failed
          return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            message: `Foreign key constraint failed on field "${meta?.field_name ?? 'unknown'}".`,
            path: request.url,
          });

        case 'P2025': // Record not found
          return response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Record not found.',
            path: request.url,
          });

        default:
          return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `DB error (${code}): ${exception.message}`,
            path: request.url,
          });
      }
    }

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    console.error('❌ Unhandled exception:', exception);

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error.',
      path: request.url,
    });
  }
}
