import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ALLCURRENCY } from 'src/app/modals';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  // @Input() allCurrencyList: any;
  fromValue = 'EUR';
  toValue = 'USD'
  latestToValue: any = '';
  enteredAmount = new FormControl(1, [Validators.required]);
  allCurrency: any;
  convertedValue: any = '--';
  historyArr: any = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getCurrencySymbols();
    this.getLatestValue();
  }

  swapConversion(): void {
    const toSwap = this.fromValue;
    this.fromValue = this.toValue;
    this.toValue = toSwap;;
    this.getLatestValue();
  }

  getLatestValue(): void {
    const params = `base=${this.fromValue}&symbols=${this.toValue}`;
    this.api.get('latest', params).pipe(take(1)).subscribe(res => {
      if (res.success) {
        this.latestToValue = res.rates[this.toValue];
      } else {
        this.latestToValue = 'ERROR'
      }
    });
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

  convert(): void {
    const params = `from=${this.fromValue}&to=${this.toValue}&amount=${this.enteredAmount.value}`;
    this.api.get('convert', params).pipe(take(1)).subscribe(res => {
      if (res && res.success) {
        this.convertedValue = res.query.amount;
        const historyObj = {
          from: this.fromValue,
          to: this.toValue,
          value: this.convertedValue,
          queryValue: this.enteredAmount.value
        };
        this.historyArr = this.api.getSessionData();
        if (this.historyArr.length >= 9) {
          this.historyArr.length = 8;
          this.historyArr.unshift(historyObj);
        } else {
          this.historyArr.unshift(historyObj);
        }
        sessionStorage.setItem('historyData', JSON.stringify(this.historyArr));
        this.api.historyEvent$.next('1');
      } else {
        this.convertedValue = 'ERROR';
      }
    });
  }

}
