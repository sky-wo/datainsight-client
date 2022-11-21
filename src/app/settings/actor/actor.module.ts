import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActorComponent} from './actor.component';
import {ConnectorRoutingModule} from "../connector/connector-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {ActorRoutingModule} from "./actor-routing.module";


@NgModule({
  declarations: [
    ActorComponent
  ],
  imports: [
    CommonModule,
    ActorRoutingModule,
    SharedModule
  ]
})
export class ActorModule {
}
