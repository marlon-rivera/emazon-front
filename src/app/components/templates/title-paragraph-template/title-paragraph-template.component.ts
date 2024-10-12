import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-paragraph-template',
  templateUrl: './title-paragraph-template.component.html',
  styleUrls: ['./title-paragraph-template.component.scss']
})
export class TitleParagraphTemplateComponent{

  @Input() title!: string;
  @Input() content!: string;

}
