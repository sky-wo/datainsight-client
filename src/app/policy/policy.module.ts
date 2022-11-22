import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PolicyRoutingModule} from './policy-routing.module';
import {PolicyComponent} from './policy.component';
import {SharedModule} from "../shared/shared.module";
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    PolicyComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    SharedModule,
    DragDropModule
  ]
})
export class PolicyModule {
}
