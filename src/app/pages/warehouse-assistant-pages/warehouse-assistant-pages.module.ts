import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseAssistantPagesRoutingModule } from './warehouse-assistant-pages-routing.module';
import { WarehouseAssistantModule } from '@/app/modules/warehouse-assistant/warehouse-assistant.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WarehouseAssistantModule,
    WarehouseAssistantPagesRoutingModule
  ]
})
export class WarehouseAssistantPagesModule { }
