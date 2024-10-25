import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-combobox-multiple",
  templateUrl: "./combobox-multiple.component.html",
  styleUrls: ["./combobox-multiple.component.scss"],
})
export class ComboboxMultipleComponent implements OnInit {
  searchControl = new FormControl("");
  optionsWidth: number = 0;
  filteredOptions: { id: number; name: string }[] = [];
  isFocused: boolean = false;
  closeTimeout: any;
  @Input() options!: { id: number; name: string }[];
  @Input() selectedItems!: { id: number; name: string }[];
  @Input() maxSelectedItems!: number;
  @Input() minSelectedItems!: number;
  @Output() blur = new EventEmitter<void>();
  @Output() selectedItemsChange = new EventEmitter<{ id: number; name: string }[]>();
  @ViewChild("comboboxDiv") comboboxDiv!: ElementRef;

  ngOnInit() {
    this.filteredOptions = [...this.options];
    this.searchControl.valueChanges.subscribe((value) => {
      if (value) this.filterOptions(value);
    });
  }

  filterOptions(value: string) {
    if (typeof value === "string") {
      if (value === "") {
        this.filteredOptions = this.options;
      } else {
        this.filteredOptions = this.options.filter((option) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
      }
    }
  }

  updateOptionsWidth(inputElement: HTMLInputElement) {
    this.optionsWidth = inputElement.offsetWidth;
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
        this.blur.emit();
      }
    }, 100);
  }

  selectOption(option: { id: number; name: string }) {
    if (
      this.selectedItems.length < this.maxSelectedItems &&
      !this.selectedItems.includes(option)
    ) {
      this.selectedItems.push(option);
      this.selectedItemsChange.emit(this.selectedItems);
    }
    this.searchControl.setValue("");
  }

  removeItem(itemId: number) {
    this.selectedItems = this.selectedItems.filter(
      (selected) => selected.id !== itemId
    );
    this.selectedItemsChange.emit(this.selectedItems);
  }

  isOptionDisabled(option: { id: number; name: string }): boolean {
    return (
      this.selectedItems.length >= this.maxSelectedItems &&
      !this.selectedItems.includes(option)
    );
  }
}
