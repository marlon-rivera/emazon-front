import { BrandsPanelPageComponent } from '@/app/modules/brand/brands-panel-page/brands-panel-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: BrandsPanelPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandPagesRoutingModule { }
