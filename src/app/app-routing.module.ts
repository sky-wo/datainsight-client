import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FrameComponent} from './shared/frame/frame.component'

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
        path: "dashboard",
        loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
      },
      {
        path: "task",
        loadChildren: () => import("./task/task.module").then(m => m.TaskModule)
      },
      {
        path: "settings",
        loadChildren: () => import("./settings/settings.module").then(m => m.SettingsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
