import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SendBoardDto } from './dto/send-board.dto';
import { BoardService } from './board.service';
import { XAppUserGuard } from 'src/auth/x-app-user.guard';

@Controller('board')
export class BoardController {
  constructor(private board: BoardService) {}

  @Get(':id')
  getBoard(@Param('id') id: string) {
    return this.board.getBoard(id);
  }

  @UseGuards(XAppUserGuard)
  @Put('/')
  putBoard(
    @Headers('X-App-User') sender: string,
    @Body() { artifacts }: SendBoardDto,
  ) {
    return this.board.sendBoard(sender, artifacts);
  }
}
