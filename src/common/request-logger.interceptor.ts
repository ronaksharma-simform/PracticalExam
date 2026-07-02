import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

const requestLog: { path: string; time: Date }[] = [];

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    requestLog.push({ path: req.url, time: new Date() });
    return next.handle();
  }
}

export function getRequestLogSize() {
  return requestLog.length;
}
