import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class XAppUserGuard implements CanActivate {
  private users: { a: string; b: string };

  constructor(config: ConfigService) {
    this.users = config.getOrThrow<{ a: string; b: string }>('users');
  }

  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.get('x-app-user');
    if (user !== this.users.a && user !== this.users.b)
      throw new UnauthorizedException();
    return true;
  }
}
