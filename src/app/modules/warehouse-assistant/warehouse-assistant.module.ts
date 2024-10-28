import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateWarehouseAssistantComponent } from './create-warehouse-assistant/create-warehouse-assistant.component';
import { UserModule } from '../user/user.module';

@NgModule({
  declarations: [
    CreateWarehouseAssistantComponent
  ],
  imports: [
    CommonModule,
    UserModule
  ]
})
export class WarehouseAssistantModule { }
