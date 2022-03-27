import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangerRoutingModule } from './exchanger-routing.module';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    HomeComponent,
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    ExchangerRoutingModule,
    NgChartsModule
  ]
})
export class ExchangerModule { }
