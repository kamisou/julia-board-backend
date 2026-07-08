import { Inject, Injectable } from '@nestjs/common';
import { BoardArtifactDto } from './dto/board-artifact.dto';
import { UsersService } from 'src/users/users.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { instanceToPlain } from 'class-transformer';
import { Messaging } from 'firebase-admin/messaging';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoardService {
  constructor(
    private users: UsersService,
    @Inject('MESSAGING') private messaging: Messaging,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private config: ConfigService,
  ) {}

  async getBoard(id: string) {
    const artifacts = await this.cache.get<BoardArtifactDto[]>(`board:${id}`);
    if (!artifacts) return [];
    return artifacts;
  }

  async sendBoard(id: string, artifacts: BoardArtifactDto[]) {
    const users = this.config.getOrThrow<{ a: string; b: string }>('users');
    const receiver = users.a == id ? users.b : users.a;

    await this.cache.set(`board:${receiver}`, instanceToPlain(artifacts));

    const user = await this.users.get(receiver).then((doc) => doc.data());
    if (!user?.fcmToken) return;

    await this.messaging.send({
      token: user.fcmToken,
      notification: {
        title: 'Nova mensagem!',
        body: 'Dê uma olhada... 👀',
      },
      data: { id },
    });
  }
}
