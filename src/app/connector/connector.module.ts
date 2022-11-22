import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConnectorRoutingModule} from './connector-routing.module';
import {ConnectorComponent} from './connector.component';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ConnectorComponent
  ],
  imports: [
    CommonModule,
    ConnectorRoutingModule,
    SharedModule
  ]
})
export class ConnectorModule {
}
