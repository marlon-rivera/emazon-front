import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DynamicTableComponent } from './dynamic-table.component';
import { DebugElement } from '@angular/core';
import { PaginationInfo } from '@/app/interfaces/pagination-info.interface';

describe('DynamicTableComponent', () => {
  let component: DynamicTableComponent;
  let fixture: ComponentFixture<DynamicTableComponent>;

  const headers = [
    { name: 'Name', sortable: true },
    { name: 'Age', sortable: false },
  ];

  const rows = [
    ['John', 25],
    ['Doe', 30],
  ];

  const paginationInfo: PaginationInfo<any> = {
    totalPages: 3,
    list: [],
    currentPage: 0,
    hasNextPage: true,
    hasPreviousPage: false,
    pageSize: 10,
    totalElements: 10
  
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicTableComponent);
    component = fixture.componentInstance;
    component.headers = headers;
    component.rows = rows;
    component.currentSortOrder = { Name: 'ASC' };
    component.currentPage = 0;
    component.totalPages = 3;
    component.maxVisiblePages = 5;
    component.paginationInfo = paginationInfo;

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

  it('should emit pageChange event when changePage is called with a valid page', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.changePage(1);
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit pageChange event when changePage is called with an invalid page', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.changePage(-1);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
    component.changePage(5);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should correctly compute visible pages', () => {
    component.currentPage = 1;
    component.totalPages = 5;
    const visiblePages = component.getVisiblePages();
    expect(visiblePages).toEqual([0, 1, 2, 3, 4]);
    component.currentPage = 0;
    const visiblePagesStart = component.getVisiblePages();
    expect(visiblePagesStart).toEqual([0, 1, 2, 3, 4]);
    component.currentPage = 4;
    const visiblePagesEnd = component.getVisiblePages();
    expect(visiblePagesEnd).toEqual([0, 1, 2, 3, 4]);
  });

  it('should calculate visible pages correctly when currentPage + halfWindow >= totalPages', () => {
    component.currentPage = 4;
    const visiblePages = component.getVisiblePages();
    expect(visiblePages).toEqual([-2, -1, 0, 1, 2]);
  });

  it('should include ellipsis at the beginning when start > 0', () => {
    component.currentPage = 2;
    component.totalPages = 5;
    const visiblePages = component.getVisiblePages();
    expect(visiblePages).toEqual([0, 1, 2, 3, 4]);
  });

  it('should include ellipsis at the end when end < totalPages', () => {
    component.currentPage = 0;
    component.totalPages = 5;
    component.maxVisiblePages = 3;
    const visiblePages = component.getVisiblePages();
    expect(visiblePages).toEqual([0, 1, 2, -1, 4]);
  });
});
