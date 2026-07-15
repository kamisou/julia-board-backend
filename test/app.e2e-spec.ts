import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('Board', () => {
  let app: INestApplication<App>;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    config = moduleFixture.get(ConfigService);

    await app.init();
  });

  it('GET /board/:id', () => {
    return request(app.getHttpServer()).get('/board/1').expect(200).expect([]);
  });

  it('PUT /board', () => {
    return request(app.getHttpServer())
      .put('/board')
      .send({
        artifacts: [
          {
            id: '0c4bcc33-0bbb-4cda-a2b9-4ec1b1eaf9ca',
            type: 'stroke',
            color: 'ffe53935',
            width: 16,
            points: [{ x: 0.18359375000000003, y: 0.4858441648230088 }],
          },
        ],
      })
      .set('X-App-User', config.getOrThrow<string>('users.a'))
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
