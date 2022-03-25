import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  openDetails(from: string, to: string): void {
    this.api.detailsVal$.next({
      from,
      to
    });
    // this.api.showDetails$.next(false);
  }

}
