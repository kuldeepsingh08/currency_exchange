import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { take } from 'rxjs/operators';
import { ALLCURRENCY } from 'src/app/modals';
import { Subscription } from 'rxjs';

interface HISTORY {
  from: string,
  to: string,
  value: any,
  queryValue: any
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  allCurrency: any;
  historyArr!: HISTORY;
  subscriptions$!: Subscription;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.subscriptions$ = this.api.historyEvent$.subscribe(res => {
      this.historyArr = this.api.getSessionData();
    })
    this.api.showDetails$.next(true);
  }

  ngOnDestroy(): void {
    try {
      this.subscriptions$.unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }

}
