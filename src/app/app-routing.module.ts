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
        path: "sources",
        loadChildren: () => import("./sources/sources.module").then(m => m.SourcesModule)
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
