import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent } from './ag-grid/grid/grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomFilterComponent } from './ag-grid/custom-filter/custom-filter.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    CustomFilterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
