import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './../../templates/title-paragraph-template/title-paragraph-template.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent{

  title: string = "Emazon";
  content: string= "Esta es la tienda mas querida del mundo."

}
