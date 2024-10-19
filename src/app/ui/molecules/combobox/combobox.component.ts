import { Component, OnInit, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-combobox",
  templateUrl: "./combobox.component.html",
  styleUrls: ["./combobox.component.scss"],
})
export class ComboboxComponent implements OnInit {
  searchControl = new FormControl("");

  @Input() options!: { id: number; name: string }[];
  filteredOptions!: { id: number; name: string }[];

  @Input() selectedItem!: { id: number; name: string } | null;

  ngOnInit() {
    this.filteredOptions = [...this.options];
    this.searchControl.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.filteredOptions = this.options.filter((option) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
      }
    });
  }

  selectOption(option: { id: number; name: string }) {
    this.selectedItem = option;
    this.searchControl.setValue(option.name);
    this.filteredOptions = [];
  }

  removeItem() {
    this.selectedItem = null;
    this.searchControl.setValue("");
    this.filteredOptions = [...this.options];
  }
}
