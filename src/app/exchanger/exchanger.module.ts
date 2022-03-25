import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangerRoutingModule } from './exchanger-routing.module';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { PanelComponent } from './panel/panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    DetailsComponent,
    PanelComponent
  ],
  imports: [
    CommonModule,
    ExchangerRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExchangerModule { }
