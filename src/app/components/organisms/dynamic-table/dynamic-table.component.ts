import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent {
  @Input() headers!: { name: string; sortable: boolean }[];
  @Input() rows!: any[];
  @Input() currentSortOrder!: { [key: string]: string };

  @Output() sortChange = new EventEmitter<string>();

  toggleSort(headerName: string): void {
    this.sortChange.emit(headerName);
  }
}
