import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Firestore } from 'firebase-admin/firestore';

describe('UsersService', () => {
  let doc: { set: () => void };
  let usersService: UsersService;
  let firestore: Firestore;

  beforeEach(async () => {
    doc = { set: jest.fn(() => {}) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'FIRESTORE',
          useValue: mockFirestore(doc),
        },
      ],
    }).compile();

    usersService = moduleRef.get(UsersService);
    firestore = moduleRef.get('FIRESTORE');
  });

  describe('get', () => {
    it('should return user data for existing user', async () => {
      expect(await usersService.get('A')).toBeTruthy();
      expect(firestore.collection).toHaveBeenCalledWith('users');
      expect(await usersService.get('B')).toBeFalsy();
      expect(firestore.collection).toHaveBeenCalledWith('users');
    });
  });

  describe('updateToken', () => {
    it('should update user token', async () => {
      expect(await usersService.updateToken('A', 'abc123')).toBeUndefined();
      expect(firestore.doc).toHaveBeenCalledWith('users/A');
      expect(doc.set).toHaveBeenCalledWith({ fcmToken: 'abc123' });
    });
  });
});

function mockFirestore(doc: { set: () => void }) {
  return {
    collection: jest.fn((path: string) => {
      if (path === 'users')
        return {
          withConverter: () => ({
            doc: (id: string) => {
              if (id === 'A')
                return {
                  get: () => ({ fcmToken: 'abc123' }),
                };
              return { get: () => null };
            },
          }),
        };
    }),
    doc: jest.fn(() => doc),
  };
}
