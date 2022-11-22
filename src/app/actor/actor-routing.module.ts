import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActorComponent} from "./actor.component";
import {AddActorComponent} from "./add-actor/add-actor.component";
import {SpecComponent} from "./spec/spec.component";
import {SelectTableComponent} from "./select-tableselect-table/select-table.component";

const routes: Routes = [
  {
    path: "",
    component: ActorComponent,
    children: []
  },
  {
    path: "addActor",
    component: AddActorComponent,
  },
  {
    path: "spec/:connectorId",
    component: SpecComponent
  },
  {
    path: "selectTable/:actorId",
    component: SelectTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActorRoutingModule {
}
