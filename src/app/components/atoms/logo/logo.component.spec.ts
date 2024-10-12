import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    component.width = 100;
    component.height = 50;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the image with correct src, width, and height', () => {
    fixture.detectChanges();
    const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(imgElement.src).toContain('assets/emazon.png');
    expect(imgElement.width).toBe(100);
    expect(imgElement.height).toBe(50);
    expect(imgElement.getAttribute('alt')).toBe('Logo');
  });
});
