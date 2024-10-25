import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComboboxMultipleComponent } from './combobox-multiple.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ComboboxMultipleComponent', () => {
  let component: ComboboxMultipleComponent;
  let fixture: ComponentFixture<ComboboxMultipleComponent>;

  const mockOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboboxMultipleComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboboxMultipleComponent);
    component = fixture.componentInstance;
    
    component.options = mockOptions;
    component.selectedItems = [];
    component.maxSelectedItems = 2;
    component.minSelectedItems = 0;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filterOptions', () => {
    it('should filter options based on search value', () => {
      component.filterOptions('Option 1');
      expect(component.filteredOptions).toEqual([mockOptions[0]]);
    });

    it('should show all options when search value is empty', () => {
      component.filterOptions('');
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should be case insensitive when filtering', () => {
      component.filterOptions('option');
      expect(component.filteredOptions).toEqual(mockOptions);
    });
  });

  describe('selectOption', () => {
    it('should add selected option to selectedItems', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      expect(component.selectedItems).toContain(option);
    });

    it('should emit selectedItemsChange when selecting an option', () => {
      jest.spyOn(component.selectedItemsChange, 'emit');
      const option = mockOptions[0];
      component.selectOption(option);
      expect(component.selectedItemsChange.emit).toHaveBeenCalledWith([option]);
    });

    it('should not add item if maxSelectedItems is reached', () => {
      component.maxSelectedItems = 1;
      component.selectOption(mockOptions[0]);
      component.selectOption(mockOptions[1]);
      expect(component.selectedItems.length).toBe(1);
    });

    it('should clear search control after selection', () => {
      component.searchControl.setValue('test');
      component.selectOption(mockOptions[0]);
      expect(component.searchControl.value).toBe('');
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      component.selectedItems = [...mockOptions];
    });

    it('should remove item from selectedItems', () => {
      component.removeItem(1);
      expect(component.selectedItems.length).toBe(2);
      expect(component.selectedItems.find(item => item.id === 1)).toBeUndefined();
    });

    it('should emit selectedItemsChange when removing an item', () => {
      jest.spyOn(component.selectedItemsChange, 'emit');
      component.removeItem(1);
      expect(component.selectedItemsChange.emit).toHaveBeenCalled();
    });
  });

  describe('focus handling', () => {
    it('should set isFocused to true on focus', () => {
      component.onFocus();
      expect(component.isFocused).toBeTruthy();
    });

    it('should clear timeout on focus', () => {
      jest.spyOn(window, 'clearTimeout');
      component.closeTimeout = setTimeout(() => {}, 1000);
      component.onFocus();
      expect(clearTimeout).toHaveBeenCalled();
    });

    it('should emit blur event when focus is lost', fakeAsync(() => {
      jest.spyOn(component.blur, 'emit');
      component.isFocused = true;
      
      jest.spyOn(component.comboboxDiv.nativeElement, 'contains').mockReturnValue(false);
      
      component.onComboboxFocusOut(new FocusEvent('focusout'));
      tick(100);
      
      expect(component.isFocused).toBeFalsy();
      expect(component.blur.emit).toHaveBeenCalled();
    }));
  });

  describe('isOptionDisabled', () => {
    it('should return true when max items selected and option not in selected items', () => {
      component.maxSelectedItems = 2;
      component.selectedItems = [mockOptions[0], mockOptions[1]];
      expect(component.isOptionDisabled(mockOptions[2])).toBeTruthy();
    });

    it('should return false when below max items', () => {
      component.maxSelectedItems = 3;
      component.selectedItems = [mockOptions[0]];
      expect(component.isOptionDisabled(mockOptions[1])).toBeFalsy();
    });
  });
});