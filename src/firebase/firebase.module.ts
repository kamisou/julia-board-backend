import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'FIREBASE_APP',
      useFactory: (config: ConfigService) =>
        initializeApp({
          credential: cert(
            config.getOrThrow<ServiceAccount>('googleServiceAccount'),
          ),
        }),
    },
    {
      provide: 'FIRESTORE',
      inject: ['FIREBASE_APP'],
      useFactory: (app: App) => getFirestore(app),
    },
    {
      provide: 'MESSAGING',
      inject: ['FIREBASE_APP'],
      useFactory: (app: App) => getMessaging(app),
    },
  ],
  exports: ['FIRESTORE', 'MESSAGING'],
})
export class FirebaseModule {}
