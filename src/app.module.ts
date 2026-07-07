import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    FirebaseModule,
    BoardModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
})
export class AppModule {}
