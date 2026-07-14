import { Test } from '@nestjs/testing';
import { BoardService } from './board.service';
import { BoardStrokeDto } from './dto/board-artifact.dto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Messaging } from 'firebase-admin/messaging';
import { Cache } from '@nestjs/cache-manager';

describe('BoardService', () => {
  const artifacts: BoardStrokeDto[] = [
    {
      id: '0c4bcc33-0bbb-4cda-a2b9-4ec1b1eaf9ca',
      type: 'stroke',
      color: 'ffe53935',
      width: 16,
      points: [{ x: 0.18359375000000003, y: 0.4858441648230088 }],
    },
  ];
  const users = {
    a: '1',
    b: '2',
  };
  const token = 'abc123';
  const msg = {
    token: token,
    notification: {
      title: 'Nova mensagem!',
      body: 'Dê uma olhada... 👀',
    },
    data: { sender: '1' },
  };

  let boardService: BoardService;
  let messaging: Messaging;
  let cache: Cache;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BoardService,
        UsersService,
        {
          provide: 'MESSAGING',
          useValue: { send: jest.fn().mockResolvedValue('message-id') },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'board:1') return artifacts;
              return undefined;
            }),
            set: jest.fn(),
          },
        },
        ConfigService,
      ],
    })
      .overrideProvider(UsersService)
      .useValue({
        get: jest.fn().mockResolvedValue({
          data: () => ({ fcmToken: token }),
        }),
      })
      .overrideProvider(ConfigService)
      .useValue({
        getOrThrow: (key: string) => {
          if (key === 'users') return users;
        },
      })
      .compile();

    boardService = moduleRef.get(BoardService);
    messaging = moduleRef.get('MESSAGING');
    cache = moduleRef.get('CACHE_MANAGER');
  });

  describe('getBoard', () => {
    it('should fetch the correct board', async () => {
      expect(await boardService.getBoard('1')).toBe(artifacts);
      expect(cache.get).toHaveBeenCalledWith('board:1');
      expect(await boardService.getBoard('2')).toEqual([]);
      expect(cache.get).toHaveBeenCalledWith('board:2');
    });
  });

  describe('sendBoard', () => {
    it('sends message and stores on cache', async () => {
      expect(await boardService.sendBoard('1', artifacts)).toBeUndefined();
      expect(cache.set).toHaveBeenCalledWith('board:2', artifacts);
      expect(messaging.send).toHaveBeenCalledWith(msg);
    });
  });
});
