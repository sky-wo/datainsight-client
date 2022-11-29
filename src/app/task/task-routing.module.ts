import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskRunListComponent } from './add-task/task-run-list/task-run-list.component';
import { TaskComponent } from './task.component';

const routes: Routes = [
  { path: "", component: TaskComponent },
  { path: "taskRun/:taskId", component: TaskRunListComponent },
  { path: "addTask", component: AddTaskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule {
}
