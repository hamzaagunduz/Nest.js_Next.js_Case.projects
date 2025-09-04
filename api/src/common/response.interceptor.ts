import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from './base-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<BaseResponse<T>> {
        return next.handle().pipe(
            map(data => new BaseResponse(data, true)) // tüm response'ları sar
        );
    }
}
