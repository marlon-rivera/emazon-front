import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AtomsModule } from "./atoms/atoms.module";
import { MoleculesModule } from "./molecules/molecules.module";
import { OrganismsModule } from "./organisms/organisms.module";
import { TemplatesModule } from "./templates/templates.module";

@NgModule({
  imports: [CommonModule, RouterModule, AtomsModule, MoleculesModule, OrganismsModule, TemplatesModule],
  exports: [
    AtomsModule, MoleculesModule, OrganismsModule, TemplatesModule
  ],
})
export class UiModule {}
