import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DynamicTableComponent } from './dynamic-table.component';
import { DebugElement } from '@angular/core';

describe('DynamicTableComponent', () => {
  let component: DynamicTableComponent;
  let fixture: ComponentFixture<DynamicTableComponent>;
  let headers = [
    { name: 'Name', sortable: true },
    { name: 'Age', sortable: false },
  ];
  let rows = [
    ['John', 25],
    ['Doe', 30],
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicTableComponent);
    component = fixture.componentInstance;
    component.headers = headers;
    component.rows = rows;
    component.currentSortOrder = { Name: 'ASC' };
    fixture.detectChanges();
  });

  it('should render table headers and rows', () => {
    const headerElements = fixture.debugElement.queryAll(By.css('.table__header-cell'));
    expect(headerElements.length).toBe(2);
    expect(headerElements[0].nativeElement.textContent).toContain('Name');
    expect(headerElements[1].nativeElement.textContent).toContain('Age');

    const rowElements = fixture.debugElement.queryAll(By.css('.table__row'));
    expect(rowElements.length).toBe(2);
    expect(rowElements[0].nativeElement.textContent).toContain('John');
    expect(rowElements[1].nativeElement.textContent).toContain('Doe');
  });

  it('should call toggleSort when sortable header button is clicked', () => {
    jest.spyOn(component, 'toggleSort');
    const buttonElement: DebugElement = fixture.debugElement.query(By.css('.table__button'));
    buttonElement.triggerEventHandler('click', null);
    expect(component.toggleSort).toHaveBeenCalledWith('Name');
  });

  it('should emit sortChange event when toggleSort is called', () => {
    jest.spyOn(component.sortChange, 'emit');
    component.toggleSort('Name');
    expect(component.sortChange.emit).toHaveBeenCalledWith('Name');
  });

});

