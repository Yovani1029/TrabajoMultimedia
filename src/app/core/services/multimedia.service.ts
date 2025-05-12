import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface MultimediaItem {
  imageUrl: string;
  description: string;
  createdAt: any;
}

@Injectable({ providedIn: 'root' })
export class MultimediaService {
  constructor(private firestore: Firestore) {}

  getMultimedia(): Observable<MultimediaItem[]> {
    const multimediaRef = collection(this.firestore, 'multimedia');
    return collectionData(multimediaRef, { idField: 'id' }) as Observable<MultimediaItem[]>;
  }
}
