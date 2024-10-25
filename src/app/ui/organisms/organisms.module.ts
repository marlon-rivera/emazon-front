import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AtomsModule } from '../atoms/atoms.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DynamicTableComponent, FooterComponent, HeaderComponent],
  imports: [
    CommonModule,
    AtomsModule,
    RouterModule
  ],
  exports: [DynamicTableComponent, FooterComponent, HeaderComponent]
})
export class OrganismsModule { }
