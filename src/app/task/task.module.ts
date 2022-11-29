import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { SharedModule } from "../shared/shared.module";
import { TaskRoutingModule } from "./task-routing.module";
import { TaskRunListComponent } from './add-task/task-run-list/task-run-list.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { SelectActorComponent } from './add-task/select-actor/select-actor.component';
import { SelectTableComponent } from './add-task/select-table/select-table.component';
import { SelectPolicyComponent } from './add-task/select-policy/select-policy.component';


@NgModule({
  declarations: [
    TaskComponent,
    TaskRunListComponent,
    AddTaskComponent,
    SelectActorComponent,
    SelectTableComponent,
    SelectPolicyComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    SharedModule
  ]
})
export class TaskModule {
}
