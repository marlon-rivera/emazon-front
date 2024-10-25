import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlPanelPagesRoutingModule } from './control-panel-pages-routing.module';
import { ControlPanelModule } from '@/app/modules/control-panel/control-panel.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ControlPanelModule,
    ControlPanelPagesRoutingModule
  ]
})
export class ControlPanelPagesModule { }
