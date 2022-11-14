import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "frameSettings"
  },
  {
    path: "frameSettings",
    component: SettingsComponent,
    children: [
      {
        path: "connector",
        loadChildren: () => import("./connector/connector.module").then(m => m.ConnectorModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
