import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddActorComponent } from './add-actor/add-actor.component';

import { SourcesComponent } from './sources.component';
import { SpecComponent } from './spec/spec.component';

const routes: Routes = [
  {
    path: "",
    component: SourcesComponent,
    children: [

    ]
  },
  {
    path: "addConnector",
    component: AddActorComponent,
  },
  {
    path: "spec/:connectorId",
    component: SpecComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourcesRoutingModule { }
