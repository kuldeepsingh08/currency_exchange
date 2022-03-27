import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/service/api.service';
import { ALLCURRENCY } from 'src/app/modals';
import { LATEST, SYMBOLS } from '../interfaces/interface';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnDestroy {
  fromValue = 'EUR';
  toValue = 'USD'
  latestToValue: any = '';
  enteredAmount = new FormControl(1, [Validators.required, Validators.min(1)]);
  allCurrency: any;
  convertedValue: any = '--';
  historyArr: any = [];
  showBtn = true;
  selectedFromFullName = '';
  symbolsObj: any;
  allRatesObj: any;
  intervalTimer: any;
  fetchNewRates = true;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.intervalTimer = setInterval(() => {
      this.fetchNewRates = true;
    }, 300000);
    this.getCurrencySymbols();
    this.api.showDetails$.subscribe(res => {
      if (res) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    })
    this.api.detailsVal$.subscribe((res: any) => {
      if (res && JSON.stringify(res) !== '{}') {
        this.fromValue = res.from;
        this.toValue = res.to;
        this.selectedFromFullName = res.fromFullName;
        this.getLatestValue();
      }
    })
  }

  swapConversion(): void {
    const toSwap = this.fromValue;
    this.fromValue = this.toValue;
    this.toValue = toSwap;
    this.selectedFromFullName = this.symbolsObj[this.fromValue];
    this.getLatestValue();
  }

  getLatestValue(): void {
    if (this.showBtn) {
      this.selectedFromFullName = this.symbolsObj[this.fromValue];
      this.api.toValueChanges$.next(this.toValue);
    }
    this.api.toValueChanges$.next(this.toValue);
    this.getAllSymbolLatestValue();
  }

  getCurrencySymbols(): void {
    this.api.get('symbols').pipe(take(1)).subscribe((res: SYMBOLS) => {
      this.symbolsObj = res.symbols;
      if (res && res.success) {
        this.selectedFromFullName = this.symbolsObj[this.fromValue];
        const arr = [];
        for (const key in this.symbolsObj) {
          if (key) {
            arr.push({
              symbol: key,
              value: this.symbolsObj[key]
            });
          }
        }
        this.allCurrency = arr;
        this.getLatestValue();
      }
    });
  }

  getConversion(convertBtnClick?: boolean): void{
    const eur1 = this.allRatesObj[this.fromValue];
    const eur2 = this.allRatesObj[this.toValue];
    this.latestToValue = eur2 / eur1;
    this.convertedValue = this.latestToValue * this.enteredAmount.value
    if (convertBtnClick) {
      if (this.enteredAmount.errors) {
        return;
      }
      this.setConvertedHistory();
    }
  }

  getAllSymbolLatestValue(): void{
    if (this.enteredAmount.errors) {
      return;
    }
    if (this.fetchNewRates) {
      this.api.get('latest').pipe(take(1)).subscribe((response: LATEST) => {
        if (response && response.success) {
          this.fetchNewRates = false;
          this.allRatesObj = response.rates;
          this.getConversion();
        } else {
          this.latestToValue = 'ERROR';
        }
      });
    } else {
      this.getConversion();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalTimer);
  }

  setConvertedHistory(): void {
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
  }

}
