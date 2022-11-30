import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PolicyComponent} from "./policy.component";

const routes: Routes = [
  {path: "", component: PolicyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule {
}
