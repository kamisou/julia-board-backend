import {
  BadRequestException,
  Body,
  Controller,
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
  @Put('/:id')
  putBoard(
    @Param('id') id: string,
    @Headers('X-App-User') user: string,
    @Body() { artifacts }: SendBoardDto,
  ) {
    if (id !== user) throw new BadRequestException();
    return this.board.sendBoard(id, artifacts);
  }
}
