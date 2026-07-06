import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { UpdateTokenDto } from './dto/update-token.dto';
import { UsersService } from './users.service';
import { XAppUserGuard } from 'src/auth/x-app-user.guard';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(XAppUserGuard)
  @Post('token')
  getToken(
    @Headers('X-App-User') user: string,
    @Body() { token }: UpdateTokenDto,
  ) {
    return this.users.updateToken(user, token);
  }
}
