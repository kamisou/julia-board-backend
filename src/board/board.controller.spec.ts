import { Test } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardStrokeDto } from './dto/board-artifact.dto';
import { XAppUserGuard } from 'src/auth/x-app-user.guard';

describe('BoardController', () => {
  const artifacts: BoardStrokeDto[] = [
    {
      id: '0c4bcc33-0bbb-4cda-a2b9-4ec1b1eaf9ca',
      type: 'stroke',
      color: 'ffe53935',
      width: 16,
      points: [{ x: 0.18359375000000003, y: 0.4858441648230088 }],
    },
  ];

  let boardController: BoardController;
  let boardService: BoardService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [BoardService],
    })
      .overrideGuard(XAppUserGuard)
      .useValue({})
      .overrideProvider(BoardService)
      .useValue({
        getBoard: jest.fn((id: string) => {
          if (id === '1') return artifacts;
          return [];
        }),
        sendBoard: jest.fn(),
      })
      .compile();

    boardController = moduleRef.get(BoardController);
    boardService = moduleRef.get(BoardService);
  });

  describe('getBoard', () => {
    it('should return an array of artifacts on valid board id', async () => {
      expect(await boardController.getBoard('1')).toBe(artifacts);
      expect(boardService.getBoard).toHaveBeenCalledWith('1');
    });

    it('should return an empty array on invalid board id', async () => {
      expect(await boardController.getBoard('2')).toEqual([]);
      expect(boardService.getBoard).toHaveBeenCalledWith('2');
    });
  });

  describe('putBoard', () => {
    it('should correctly write to board when user writes to their board', () => {
      expect(boardController.putBoard('1', { artifacts })).toBeUndefined();
      expect(boardService.sendBoard).toHaveBeenCalledWith('1', artifacts);
    });
  });
});
