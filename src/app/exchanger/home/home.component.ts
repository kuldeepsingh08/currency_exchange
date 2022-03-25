import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { take } from 'rxjs/operators';
import { ALLCURRENCY } from 'src/app/modals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allCurrency: any;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getCurrencySymbols();
  }

  getCurrencySymbols(): void {
    this.api.get('symbols').pipe(take(1)).subscribe((res: any) => {
      const symbolsObj = res.symbols;
      if (res && res.success) {
        const arr = [];
        for (const key in symbolsObj) {
          if (key) {
            arr.push({
              symbol: key,
              value: symbolsObj[key]
            });
          }
        }
        console.log('checkValue', arr);
        this.allCurrency = arr;
      }
    });
  }

}
