import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/organisms/login/login.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { ControlPanelPageComponent } from './components/pages/control-panel-page/control-panel-page.component';
import { CategoriesPanelPageComponent } from './components/pages/categories-panel-page/categories-panel-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component : LoginComponent},
  {path: 'control-panel', component: ControlPanelPageComponent},
  {path: 'control-panel/categories', component: CategoriesPanelPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
