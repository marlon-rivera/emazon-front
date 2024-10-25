import { Option } from "@/app/shared/interfaces/option.interface";
import { EMPTY } from "@/app/shared/utils/api.constants";
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { FormControl, Validators, AbstractControl } from "@angular/forms";

@Component({
  selector: "app-combobox",
  templateUrl: "./combobox.component.html",
  styleUrls: ["./combobox.component.scss"],
})
export class ComboboxComponent implements OnInit {
  @Input() options!: Option[];
  @Output() controlChange = new EventEmitter<Option | null>();
  @Output() blur = new EventEmitter<void>();
  @Input() searchControl!: FormControl;
  @ViewChild('comboboxDiv') comboboxDiv!: ElementRef;

  filteredOptions!: Option[];
  isFocused: boolean = false;
  optionsWidth: number = 0;
  optionsTop: number = 0;
  closeTimeout: any;

  ngOnInit() {
    this.filteredOptions = this.options;
    this.searchControl.setValidators([this.optionValidator.bind(this)]);
    this.searchControl.valueChanges.subscribe((value) => {
      this.filterOptions(value);
    });
  }

  filterOptions(value: string) {
    if (typeof value === 'string') {
      if (value === '') {
        this.filteredOptions = this.options;
      } else {
        this.filteredOptions = this.options.filter((option) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
      }
    } else if (value === EMPTY) {
      this.filteredOptions = this.options;
    }
  }

  onFocus() {
    this.isFocused = true;
    this.filteredOptions = this.options;
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
  }

  onComboboxFocusOut(event: FocusEvent) {
    this.closeTimeout = setTimeout(() => {
      if (!this.comboboxDiv.nativeElement.contains(document.activeElement)) {
        this.isFocused = false;
        this.validateSelection();
        this.blur.emit();
      }
    }, 100);
  }

  selectOption(option: Option) {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.searchControl.setValue(option);
    this.controlChange.emit(option);
    this.isFocused = false;
  }

  optionValidator(control: AbstractControl) {
    const value = control.value;
    if (value === '' || value === EMPTY || value === null) {
      return null;
    }
    const isValid = this.options.some(
      (option) => option.name.toLowerCase() === (typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase())
    );
    return isValid ? null : { invalidOption: true };
  }

  validateSelection() {
    const currentValue = this.searchControl.value;
    if (typeof currentValue === 'string' && currentValue !== '') {
      const selectedOption = this.options.find(option => option.name.toLowerCase() === currentValue.toLowerCase());
      if (selectedOption) {
        this.selectOption(selectedOption);
      } else {
        this.searchControl.setErrors({'invalidOption': true});
        this.controlChange.emit(null);
      }
    } else if (currentValue === '') {
      this.controlChange.emit(null);
    }
  }
}
