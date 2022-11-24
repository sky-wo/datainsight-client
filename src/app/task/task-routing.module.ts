import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskRunListComponent } from './task-run-list/task-run-list.component';
import { TaskComponent } from './task.component';

const routes: Routes = [
  { path: "", component: TaskComponent },
  { path: "taskRun/:taskId", component: TaskRunListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule {
}
