import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/service/api.service';
import { HISTORYDATA, LATEST, SYMBOLS } from '../interfaces/interface';

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
  showBtn = true;
  selectedFromFullName = '';
  symbolsObj: any;
  allRatesObj: any;
  intervalTimer: any;
  fetchNewRates = true;
  topCurrencyFlag = true;
  topNineCurrency = ['USD', 'INR', 'GBP', 'AED', 'JPY', 'CHF', 'CAD', 'ZAR', 'RSD']

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    sessionStorage.setItem('historyData', JSON.stringify([]));
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
        this.getAllSymbolLatestValue();
      }
    })
  }

  swapConversion(): void {
    const toSwap = this.fromValue;
    this.fromValue = this.toValue;
    this.toValue = toSwap;
    this.selectedFromFullName = this.symbolsObj[this.fromValue];
    this.convertedValue = '--';
    this.getAllSymbolLatestValue();
  }

  fromChanges(): void {
    if (this.showBtn) {
      this.selectedFromFullName = this.symbolsObj[this.fromValue];
      this.api.toValueChanges$.next(this.toValue);
    }
    this.convertedValue = '--';
    this.getAllSymbolLatestValue();
  }

  toChanges(): void {
    this.api.toValueChanges$.next(this.toValue);
    this.convertedValue = '--';
    this.getAllSymbolLatestValue();
  }

  getCurrencySymbols(): void {
    this.api.getSymbols('symbols').pipe(take(1)).subscribe((res: SYMBOLS) => {
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
        this.getAllSymbolLatestValue();
      }
    });
  }

  getConversion(convertBtnClick?: boolean): void{
    const eur1 = this.allRatesObj[this.fromValue];
    const eur2 = this.allRatesObj[this.toValue];
    this.latestToValue = eur2 / eur1;
    if (convertBtnClick) {
      if (this.enteredAmount.errors) {
        return;
      }
      this.convertedValue = this.latestToValue * this.enteredAmount.value
      this.setConvertedHistory();
    } else {
      this.convertedValue = '--';
    }
  }

  getAllSymbolLatestValue(): void{
    if (this.enteredAmount.errors) {
      return;
    }
    if (this.fetchNewRates) {
      this.api.getLatest('latest').pipe(take(1)).subscribe((response: LATEST) => {
        if (response && response.success) {
          this.fetchNewRates = false;
          this.allRatesObj = response.rates;
          this.getConversion();
          if (this.topCurrencyFlag) {
            this.storeTopNineCurrency();
            this.topCurrencyFlag = false;
          }
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
      const historyArr = this.api.getSessionData();
      const historyExistIndex = historyArr.findIndex(
        element => element.from === historyObj.from && element.to === historyObj.to
      )
      if (historyExistIndex >= 0) {
        historyArr.splice(historyExistIndex, 1);
        this.storeConversionHistory(historyObj, historyArr);
      } else {
        this.storeConversionHistory(historyObj, historyArr);
      }
  }

  storeConversionHistory(obj: HISTORYDATA, arr: HISTORYDATA[]): void {
    if (arr.length >= 9) {
      arr.length = 8;
      arr.unshift(obj);
    } else {
      arr.unshift(obj);
    }
    sessionStorage.setItem('historyData', JSON.stringify(arr));
    this.api.historyEvent$.next('1');
  }

  storeTopNineCurrency(): void {
    const historyArr = this.api.getSessionData();
    this.topNineCurrency.forEach(element => {
      const historyObj = {
        from: 'EUR',
        to: element,
        value: this.allRatesObj[element],
        queryValue: 1
      };
      // this.storeConversionHistory(historyObj, [])
      historyArr.push(historyObj);
      sessionStorage.setItem('historyData', JSON.stringify(historyArr));
      this.api.historyEvent$.next('1');
    });

  }

}
