import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActorComponent} from "./actor.component";

const routes: Routes = [
  {path: "", component: ActorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActorRoutingModule {
}
