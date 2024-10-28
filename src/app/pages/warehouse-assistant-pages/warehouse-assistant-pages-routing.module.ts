import { CreateWarehouseAssistantComponent } from '@/app/modules/warehouse-assistant/create-warehouse-assistant/create-warehouse-assistant.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CreateWarehouseAssistantComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseAssistantPagesRoutingModule { }
