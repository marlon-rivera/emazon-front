import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsPanelPageComponent } from './brands-panel-page/brands-panel-page.component';
import { CreateBrandComponent } from './create-brand/create-brand.component';
import { UiModule } from '@/app/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [BrandsPanelPageComponent, CreateBrandComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule
  ],
  exports: [BrandsPanelPageComponent]
})
export class BrandModule { }
