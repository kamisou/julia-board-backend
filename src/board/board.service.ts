import { Inject, Injectable } from '@nestjs/common';
import { BoardArtifactDto } from './dto/board-artifact.dto';
import { UsersService } from 'src/users/users.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { instanceToPlain } from 'class-transformer';
import { Messaging } from 'firebase-admin/messaging';

@Injectable()
export class BoardService {
  constructor(
    private users: UsersService,
    @Inject('MESSAGING') private messaging: Messaging,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getBoard(id: string) {
    const artifacts = await this.cache.get<BoardArtifactDto[]>(`board:${id}`);
    if (!artifacts) return [];
    return artifacts;
  }

  async sendBoard(id: string, artifacts: BoardArtifactDto[]) {
    await this.cache.set(`board:${id}`, instanceToPlain(artifacts));

    const users = await this.users.getAll();
    const tokens = users.docs
      .filter((user) => user.id !== id)
      .map((user) => user.data()?.fcmToken)
      .filter((e) => e !== undefined);

    if (!tokens || tokens.length === 0) return;

    await this.messaging.sendEachForMulticast({
      tokens: tokens,
      notification: {
        title: 'Nova mensagem!',
        body: 'Dê uma olhada... 👀',
      },
      data: { id },
    });
  }
}
