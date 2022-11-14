import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsMenuComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
