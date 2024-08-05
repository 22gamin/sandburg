import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  statusCode: number;
  data: T;
}

// {
//     message: "회원가입 성공",
//     statusCode: 201,
//     data: createdTodo
// };

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {

    const currentContext = context.switchToHttp().getResponse().statusCode;
    const messageFromMetaData = this.reflector.get<string>('response-message', context.getHandler());
    return next.handle().pipe(
      map((data) => (
        {
        message: messageFromMetaData || data.message ||'',
        statusCode: currentContext,
        data: data.data || data || null,
      })),
    );
  }
}
