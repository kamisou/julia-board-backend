import { Inject, Injectable } from '@nestjs/common';
import { Firestore, FirestoreDataConverter } from 'firebase-admin/firestore';
import { User } from './domain/user.entity';

const converter: FirestoreDataConverter<User | null> = {
  fromFirestore: (snapshot) => {
    if (!snapshot.exists) return null;
    const data = snapshot.data();
    return { fcmToken: data.fcmToken as string | undefined };
  },
  toFirestore: (user: User) => ({ ...user }),
};

@Injectable()
export class UsersService {
  constructor(@Inject('FIRESTORE') private firestore: Firestore) {}

  getAll() {
    return this.firestore.collection('users').withConverter(converter).get();
  }

  async updateToken(user: string, token: string) {
    await this.firestore.doc(`users/${user}`).set({ fcmToken: token });
  }
}
