import { Global, Module } from '@nestjs/common';
import { App, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      useValue: initializeApp(),
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
