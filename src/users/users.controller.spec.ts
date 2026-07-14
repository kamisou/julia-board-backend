import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { XAppUserGuard } from 'src/auth/x-app-user.guard';
import { UsersService } from './users.service';

describe('UserController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const token = 'ABC123';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideGuard(XAppUserGuard)
      .useValue({})
      .overrideProvider(UsersService)
      .useValue({ updateToken: jest.fn() })
      .compile();

    usersService = moduleRef.get(UsersService);
    usersController = moduleRef.get(UsersController);
  });

  describe('postToken', () => {
    it('should update token', async () => {
      expect(await usersController.postToken('A', { token })).toBeUndefined();
      expect(usersService.updateToken).toHaveBeenCalledWith('A', token);
    });
  });
});
