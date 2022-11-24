import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskComponent} from './task.component';
import {SharedModule} from "../shared/shared.module";
import {TaskRoutingModule} from "./task-routing.module";
import { TaskRunListComponent } from './task-run-list/task-run-list.component';


@NgModule({
  declarations: [
    TaskComponent,
    TaskRunListComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    SharedModule
  ]
})
export class TaskModule {
}
