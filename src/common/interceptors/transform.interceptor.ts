import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../interfaces';

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`;
  });
}

function transformToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformToSnakeCase(item));
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (obj !== null && typeof obj === 'object') {
    const snakeCaseObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = toSnakeCase(key);
        snakeCaseObj[snakeKey] = transformToSnakeCase(obj[key]);
      }
    }
    return snakeCaseObj;
  }

  return obj;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: context.switchToHttp().getResponse().statusCode,
        message: 'SUCCESS',
        data: transformToSnakeCase(data),
      })),
    );
  }
}
