import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message when show is true', () => {
    component.message = 'This is a success message';
    component.type = 'success';
    component.show = true;
    fixture.detectChanges();
    const notificationElement = fixture.debugElement.query(By.css('.notification'));
    expect(notificationElement.nativeElement.textContent).toContain('This is a success message');
    expect(notificationElement.classes['success']).toBe(true);
  });

  it('should apply the error class when type is error', () => {
    component.message = 'This is an error message';
    component.type = 'error';
    component.show = true;
    fixture.detectChanges();
    const notificationElement = fixture.debugElement.query(By.css('.notification'));
    expect(notificationElement.nativeElement.textContent).toContain('This is an error message');
    expect(notificationElement.classes['error']).toBe(true);
  });

  it('should not display the notification when show is false', () => {
    component.show = false;
    fixture.detectChanges();
    const notificationElement = fixture.debugElement.query(By.css('.notification'));
    expect(notificationElement).toBeNull();
  });
});
