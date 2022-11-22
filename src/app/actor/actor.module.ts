import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActorComponent} from './actor.component';
import {SharedModule} from "../shared/shared.module";
import {ActorRoutingModule} from "./actor-routing.module";
import {SpecComponent} from "./spec/spec.component";
import {AddActorComponent} from "./add-actor/add-actor.component";
import {ActorListComponent} from "./actor-list/actor-list.component";
import {JsonformsModule} from "@skywo/jsonforms";
import {JsonformsrenderZorroModule} from "@skywo/jsonformsrenderzorro";
import {SelectTableComponent} from "./select-tableselect-table/select-table.component";


@NgModule({
  declarations: [
    ActorComponent,
    SpecComponent,
    AddActorComponent,
    ActorListComponent,
    SelectTableComponent

  ],
  imports: [
    CommonModule,
    ActorRoutingModule,
    SharedModule,
    JsonformsModule,
    JsonformsrenderZorroModule
  ]
})
export class ActorModule {
}
