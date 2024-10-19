import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent{

  title: string = "Emazon";
  content: string= "Esta es la tienda mas querida del mundo."

}
