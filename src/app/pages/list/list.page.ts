import { Component, OnInit } from '@angular/core';
import { MultimediaService, MultimediaItem } from 'src/app/core/services/multimedia.service';
import { Observable } from 'rxjs';
import { SharedPreferencesService } from 'src/app/shared/shared-preferences.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false
})
export class ListPage implements OnInit {
  multimedia$!: Observable<MultimediaItem[]>;

  constructor(private multimediaService: MultimediaService,
    private shared: SharedPreferencesService
  ) {}

  async ngOnInit() {
    this.multimedia$ = this.multimediaService.getMultimedia();
    var data = await this.shared.getDataFromPreferences();
    console.log("holis" + data)

  }

  formatDate(date: any): string {
    return new Date(date.seconds * 1000).toLocaleString();
  }



  
}
