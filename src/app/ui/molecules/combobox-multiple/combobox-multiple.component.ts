import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-combobox-multiple',
  templateUrl: './combobox-multiple.component.html',
  styleUrls: ['./combobox-multiple.component.scss']
})
export class ComboboxMultipleComponent implements OnInit {
  searchControl = new FormControl('');
  @Input() options!: {id: number, name: string}[];
  
  filteredOptions: {id: number, name: string}[] = [];
  @Input() selectedItems!: {id: number, name: string}[];

  @Input() maxSelectedItems!: number;
  @Input() minSelectedItems!: number;

  ngOnInit() {
    this.filteredOptions = [...this.options]
    this.searchControl.valueChanges.subscribe(value => {
      if(value != null){
        this.filteredOptions = this.options.filter(option =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
      }
    });
  }
  selectOption(option: {id: number, name: string}) {
    if (this.selectedItems.length < this.maxSelectedItems && !this.selectedItems.includes(option)) {
      this.selectedItems.push(option);
    }
  }

  removeItem(item: number) {
    this.selectedItems = this.selectedItems.filter(selected => selected.id !== item);
  }

  isOptionDisabled(option: {id: number, name: string}): boolean {
    return this.selectedItems.length >= this.maxSelectedItems && !this.selectedItems.includes(option);
  }
}
