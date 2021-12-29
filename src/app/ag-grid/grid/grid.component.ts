import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CustomFilterComponent } from '../custom-filter/custom-filter.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  }

  columnDefs: ColDef[] = [
    { field: 'make', filterFramework: CustomFilterComponent },
    { field: 'model' },
    { field: 'ponies'}
  ];

  rowData = [
    { make: 'Volkswagen', model: 'Golf', ponies: 147 },
    { make: 'Volkswagen', model: 'Golf GTI', ponies: 241 },
    { make: 'Volkswagen', model: 'Golf R', ponies: 315 },
    { make: 'Audi', model: 'RS3', ponies: 394 },
    { make: 'Subaru', model: 'Impreza', ponies: 152 },
    { make: 'Subaru', model: 'Impreza WRX', ponies: 268 },
    { make: 'Subaru', model: 'Impreza WRX STI', ponies: 305 },
    { make: 'Subaru', model: 'BRZ', ponies: 228 },
    { make: 'Ford', model: 'Focus', ponies: 160 },
    { make: 'Ford', model: 'Focus ST', ponies: 252 },
    { make: 'Ford', model: 'Focus RS', ponies: 350 },
    { make: 'Tesla', model: 'Model 3', ponies: 252 },
    { make: 'Tesla', model: 'Model 3 Performance', ponies: 430 },
    { make: 'Smart', model: 'fortwo', ponies: 89 },
  ];
}
