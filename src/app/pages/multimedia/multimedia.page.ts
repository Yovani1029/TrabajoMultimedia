import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.page.html',
  styleUrls: ['./multimedia.page.scss'],
  standalone: false
})
export class MultimediaPage implements OnInit {
  multimedia: any[] = [];  // Lista de elementos multimedia

  constructor(private firestore: Firestore) {}

ngOnInit() {
  this.loadMultimedia();
  setInterval(() => {
    this.loadMultimedia(); // Recargar los datos cada 5 segundos
  }, 5000);
}


  async loadMultimedia() {
    const multimediaCollection = collection(this.firestore, 'multimedia');
    const querySnapshot = await getDocs(multimediaCollection);
    
    this.multimedia = querySnapshot.docs.map(doc => doc.data());
    console.log(this.multimedia);
  }
}
