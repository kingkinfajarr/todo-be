import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '../interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let message = 'ERROR';
    switch (status) {
      case HttpStatus.NOT_FOUND:
        message = 'NOT_FOUND';
        break;
      case HttpStatus.FORBIDDEN:
        message = 'FORBIDDEN';
        break;
      case HttpStatus.UNAUTHORIZED:
        message = 'UNAUTHORIZED';
        break;
      case HttpStatus.BAD_REQUEST:
        message = 'BAD_REQUEST';
        break;
      case HttpStatus.CONFLICT:
        message = 'CONFLICT';
        break;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        message = 'UNPROCESSABLE_ENTITY';
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        message = 'INTERNAL_SERVER_ERROR';
        break;
      default:
        message = 'ERROR';
    }

    const errorResponse: BaseResponse<null> = {
      code: status,
      message,
      errors: {},
    };

    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      const validationErrors = {};
      for (const constraint of exceptionResponse.message) {
        if (typeof constraint === 'object' && constraint.constraints) {
          validationErrors[constraint.property] = Object.values(
            constraint.constraints,
          )[0];
        }
      }
      errorResponse.errors = validationErrors;
    } else if (typeof exceptionResponse === 'string') {
      errorResponse.errors = {
        message: exceptionResponse,
      };
    } else if (exceptionResponse.message) {
      if (Array.isArray(exceptionResponse.message)) {
        errorResponse.errors = {
          message: exceptionResponse.message[0],
        };
      } else {
        errorResponse.errors = {
          message: exceptionResponse.message,
        };
      }
    }

    response.status(status).json(errorResponse);
  }
}
