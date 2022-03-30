import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { appStrings } from '../constants/constant';
import { HISTORYDATA } from '../interfaces/interface';
import { Latest, PastData, Symbol } from '../modals/response.modal';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  fixerApiKey = appStrings.newFixerApiKey;
  fixerUrl = 'http://data.fixer.io/api';
  historyEvent$ = new BehaviorSubject('1');
  showDetails$ = new BehaviorSubject(true);
  detailsVal$ = new BehaviorSubject({});
  fixerPastYearApiKey = appStrings.newFixerPastDataApiKey;
  toValueChanges$ = new Subject();

  constructor(private http: HttpClient) { }

  getSessionData(): HISTORYDATA[] {
    const data = sessionStorage.getItem('historyData');
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  getSymbols(url: string): Observable<Symbol>{
    const uri = `${this.fixerUrl}/${url}?access_key=${this.fixerApiKey}`;
    return this.http.get<Symbol>(uri)
  }

  getLatest(url: string): Observable<Latest>{
    const uri = `${this.fixerUrl}/${url}?access_key=${this.fixerApiKey}`;
    return this.http.get<Latest>(uri)
  }

  getPastYearData(date: string, params: string): Observable<PastData> {
    return this.http.get<PastData>(`${this.fixerUrl}/${date}?access_key=${this.fixerPastYearApiKey}&symbols=${params}`);
  }
}
