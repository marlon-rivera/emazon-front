import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleParagraphTemplateComponent } from './title-paragraph-template.component';

describe('TitleParagraphTemplateComponent', () => {
  let component: TitleParagraphTemplateComponent;
  let fixture: ComponentFixture<TitleParagraphTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleParagraphTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleParagraphTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
