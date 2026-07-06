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
  private users: string[];

  constructor(config: ConfigService) {
    this.users = [
      config.getOrThrow<string>('USER_A'),
      config.getOrThrow<string>('USER_B'),
    ];
  }

  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.headers['x-app-user'];
    if (user === typeof 'string' && this.users.includes(user))
      throw new UnauthorizedException();
    return true;
  }
}
