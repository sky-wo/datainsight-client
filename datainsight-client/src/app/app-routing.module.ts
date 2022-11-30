import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrameComponent } from './shared/frame/frame.component'

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "frame"
  },
  {
    path: "frame",
    component: FrameComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard"
      },
      {
        path: "dashboard",
        loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
      },
      {
        path: "task",
        loadChildren: () => import("./task/task.module").then(m => m.TaskModule)
      },
      {
        path: "connector",
        loadChildren: () => import("./connector/connector.module").then(m => m.ConnectorModule)
      },
      {
        path: "actor",
        loadChildren: () => import("./actor/actor.module").then(m => m.ActorModule)
      },
      {
        path: "policy",
        loadChildren: () => import("./policy/policy.module").then(m => m.PolicyModule)
      },
      {
        path: "alert",
        loadChildren: () => import("./alert/alert.module").then(m => m.AlertModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
