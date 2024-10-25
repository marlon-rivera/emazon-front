import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComboboxComponent } from './combobox.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EMPTY } from '@/app/shared/utils/api.constants';
import { Option } from '@/app/shared/interfaces/option.interface';

describe('ComboboxComponent', () => {
  let component: ComboboxComponent;
  let fixture: ComponentFixture<ComboboxComponent>;

  const mockOptions: Option[] = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboboxComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboboxComponent);
    component = fixture.componentInstance;
    
    component.options = mockOptions;
    component.searchControl = new FormControl('');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set initial filtered options', () => {
      component.ngOnInit();
      expect(component.filteredOptions).toEqual(mockOptions);
    });
  });

  describe('filterOptions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should show all options when search value is empty string', () => {
      component.filterOptions('');
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should show all options when search value is EMPTY constant', () => {
      component.filterOptions(EMPTY);
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should filter options case-insensitively', () => {
      component.filterOptions('OPTION 1');
      expect(component.filteredOptions).toEqual([mockOptions[0]]);
    });

    it('should handle partial matches', () => {
      component.filterOptions('Option');
      expect(component.filteredOptions).toEqual(mockOptions);
    });
  });

  describe('onFocus', () => {
    it('should set isFocused to true', () => {
      component.onFocus();
      expect(component.isFocused).toBeTruthy();
    });

    it('should reset filtered options to all options', () => {
      component.filteredOptions = [];
      component.onFocus();
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should clear existing timeout', () => {
      jest.spyOn(window, 'clearTimeout');
      component.closeTimeout = setTimeout(() => {}, 1000);
      component.onFocus();
      expect(clearTimeout).toHaveBeenCalled();
    });
  });

  describe('onComboboxFocusOut', () => {
    it('should set isFocused to false after timeout', fakeAsync(() => {
      component.isFocused = true;
      jest.spyOn(component.comboboxDiv.nativeElement, 'contains').mockReturnValue(false);
      
      component.onComboboxFocusOut(new FocusEvent('focusout'));
      tick(100);
      
      expect(component.isFocused).toBeFalsy();
    }));

    it('should emit blur event after timeout', fakeAsync(() => {
      jest.spyOn(component.blur, 'emit');
      jest.spyOn(component.comboboxDiv.nativeElement, 'contains').mockReturnValue(false);
      
      component.onComboboxFocusOut(new FocusEvent('focusout'));
      tick(100);
      
      expect(component.blur.emit).toHaveBeenCalled();
    }));

    it('should validate selection on focus out', fakeAsync(() => {
      jest.spyOn(component, 'validateSelection');
      jest.spyOn(component.comboboxDiv.nativeElement, 'contains').mockReturnValue(false);
      
      component.onComboboxFocusOut(new FocusEvent('focusout'));
      tick(100);
      
      expect(component.validateSelection).toHaveBeenCalled();
    }));
  });

  describe('selectOption', () => {
    it('should set search control value', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      expect(component.searchControl.value).toEqual(option);
    });

    it('should emit controlChange event', () => {
      jest.spyOn(component.controlChange, 'emit');
      const option = mockOptions[0];
      component.selectOption(option);
      expect(component.controlChange.emit).toHaveBeenCalledWith(option);
    });

    it('should set isFocused to false', () => {
      component.isFocused = true;
      component.selectOption(mockOptions[0]);
      expect(component.isFocused).toBeFalsy();
    });

    it('should clear any existing timeout', () => {
      jest.spyOn(window, 'clearTimeout');
      component.closeTimeout = setTimeout(() => {}, 1000);
      component.selectOption(mockOptions[0]);
      expect(clearTimeout).toHaveBeenCalled();
    });
  });

  describe('optionValidator', () => {
    it('should return null for empty string', () => {
      const result = component.optionValidator(new FormControl(''));
      expect(result).toBeNull();
    });

    it('should return null for EMPTY constant', () => {
      const result = component.optionValidator(new FormControl(EMPTY));
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const result = component.optionValidator(new FormControl(null));
      expect(result).toBeNull();
    });

    it('should return null for valid option name', () => {
      const result = component.optionValidator(new FormControl('Option 1'));
      expect(result).toBeNull();
    });

    it('should return error for invalid option name', () => {
      const result = component.optionValidator(new FormControl('Invalid Option'));
      expect(result).toEqual({ invalidOption: true });
    });
  });

  describe('validateSelection', () => {
    it('should select matching option when string matches option name', () => {
      jest.spyOn(component, 'selectOption');
      component.searchControl.setValue('Option 1');
      component.validateSelection();
      expect(component.selectOption).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should set error and emit null when no matching option found', () => {
      jest.spyOn(component.controlChange, 'emit');
      component.searchControl.setValue('Invalid Option');
      component.validateSelection();
      
      expect(component.searchControl.errors).toEqual({ invalidOption: true });
      expect(component.controlChange.emit).toHaveBeenCalledWith(null);
    });

    it('should emit null when value is empty string', () => {
      jest.spyOn(component.controlChange, 'emit');
      component.searchControl.setValue('');
      component.validateSelection();
      expect(component.controlChange.emit).toHaveBeenCalledWith(null);
    });
  });
});