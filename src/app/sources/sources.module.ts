import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SourcesRoutingModule } from './sources-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SourcesComponent } from './sources.component';
import { SpecComponent } from './spec/spec.component';
import { AddActorComponent } from './add-actor/add-actor.component';
import { ActorListComponent } from './actor-list/actor-list.component'
import { JsonformsModule } from '@skywo/jsonforms';
import { JsonformsrenderZorroModule } from '@skywo/jsonformsrenderzorro';
import { SelectTableComponent } from './select-table/select-table.component';
@NgModule({
  declarations: [
    SourcesComponent,
    SpecComponent,
    AddActorComponent,
    ActorListComponent,
    SelectTableComponent,
  ],
  imports: [
    CommonModule,
    SourcesRoutingModule,
    SharedModule,
    JsonformsModule,
    JsonformsrenderZorroModule
  ]
})
export class SourcesModule { }
