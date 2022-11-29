import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PolicyRoutingModule} from './policy-routing.module';
import {PolicyComponent} from './policy.component';
import {SharedModule} from "../shared/shared.module";
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PolicyTreeComponent } from './policy-tree/policy-tree.component';

@NgModule({
  declarations: [
    PolicyComponent,
    PolicyTreeComponent
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
