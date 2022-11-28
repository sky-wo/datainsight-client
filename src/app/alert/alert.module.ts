import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertRoutingModule } from './alert-routing.module';
import { AlertComponent } from './alert.component';
import { AlertListComponent } from './alert-list/alert-list.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AlertComponent,
    AlertListComponent,

  ],
  imports: [
    CommonModule,
    AlertRoutingModule,
    SharedModule
  ]
})
export class AlertModule { }
