import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  fixerApiKey = '941a8b11bb4cb0f2c65f1de1609306b0';
  fixerUrl = 'http://data.fixer.io/api';
  historyEvent$ = new BehaviorSubject('1');
  showDetails$ = new BehaviorSubject(true);
  detailsVal$ = new BehaviorSubject({});
  fixerPastYearApiKey = 'f540df05b442f1dcbec7eb549eb8e79c';
  toValueChanges$ = new Subject();

  constructor(private http: HttpClient) { }

  get(url: string, params?: any): Observable<any>{
    let uri;
    if (params) {
      uri = `${this.fixerUrl}/${url}?access_key=${this.fixerApiKey}&${params}`;
    } else {
      uri = `${this.fixerUrl}/${url}?access_key=${this.fixerApiKey}`;
    }
    return this.http.get(uri);
  }

  getSessionData(): any {
    const data = sessionStorage.getItem('historyData');
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  getPastYearData(date: string, params: string): Observable<any> {
    return this.http.get(`${this.fixerUrl}/${date}?access_key=${this.fixerPastYearApiKey}&symbols=${params}`);
  }
}
