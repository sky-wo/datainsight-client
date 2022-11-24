import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PolicyRoutingModule} from './policy-routing.module';
import {PolicyComponent} from './policy.component';
import {SharedModule} from "../shared/shared.module";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TreeComponent} from "./tree/tree.component";
import {NgxGraphModule} from "@swimlane/ngx-graph";

@NgModule({
  declarations: [
    PolicyComponent,
    TreeComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    SharedModule,
    DragDropModule,
    NgxGraphModule
  ]
})
export class PolicyModule {
}
