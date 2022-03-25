import { Component, Input, OnInit } from '@angular/core';
import { ALLCURRENCY } from 'src/app/modals';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  @Input() allCurrencyList: any;

  constructor() { }

  ngOnInit(): void {
  }

}
