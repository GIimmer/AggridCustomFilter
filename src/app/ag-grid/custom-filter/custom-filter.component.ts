import { Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, AgPromise, IFilterParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { hashmapFromArray } from 'src/app/utils/general.utils';
import { SubSink } from 'subsink';

export interface CustomFilterModel {
  type: string;
  filter: string;
}

export enum FilterType {
  contains = 'Contains',
  notContains = 'Not Contains',
  equals = 'Equals',
  notEquals = 'Not Equals',
  startsWith = 'Starts With',
  endsWith = 'Ends With',
  isContainedIn = 'Is Contained In',
  isNotContainedIn = 'Is Not Contained In'
}

@Component({
  selector: 'app-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent implements IFilterAngularComp, OnDestroy {
  @ViewChild('input', { read: ViewContainerRef }) public input: ViewContainerRef | undefined;

  filterTypes: string[] = Object.values(FilterType);
  filterType = new FormControl(FilterType.contains);
  filter = new FormControl('');

  private subs: SubSink = new SubSink();
  private params: IFilterParams | undefined;

  private currentModel: CustomFilterModel = { type: '', filter: '' };
  private valueAccessor: ((date: IDoesFilterPassParams) => string) | undefined;
  private checkValuePassesFilter: ((val: string) => boolean) | undefined;

  agInit(params: IFilterParams): void {
    this.params = params;
    this.subs.sink = this.filter.valueChanges.subscribe((filter: string) => this.onChange({ filter }));
    this.subs.sink = this.filterType.valueChanges.subscribe((type: FilterType) => this.onChange({ type }));
    this.filterType.setValue(this.filterTypes[0]);

    const colId = params.colDef.field as string;
    this.valueAccessor = (params: IDoesFilterPassParams) => params.data[colId].toLowerCase();
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    window.setTimeout(() => this.input?.element.nativeElement.focus());
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }

  isFilterActive(): boolean {
    return !!this.currentModel?.filter;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const colVal = this.valueAccessor?.(params).toLowerCase() as string;
    return this.checkValuePassesFilter?.(colVal) as boolean;
  }

  getModel() {
    return this.currentModel;
  }

  setModel(model: any): void {
    if (!model) return;

    this.currentModel = model;

    this.checkValuePassesFilter = this.getValueTester(model.type, model.filter);

    this.filterType.setValue(model.type, { emitEvent: false });
    this.filter.setValue(model.filter, { emitEvent: false });
  }

  private getValueTester(type: FilterType, filter: string) {
    const filterLowerCase = filter.toString().toLowerCase();

    switch (type) {
      // ----- Standard Filters ----- //
      case FilterType.contains:
        return (value: string) => value.indexOf(filterLowerCase) >= 0;
      case FilterType.notContains:
        return (value: string) => value.indexOf(filterLowerCase) === -1;
      case FilterType.equals:
        return (value: string) => value === filterLowerCase;
      case FilterType.notEquals:
        return (value: string) => value !== filterLowerCase;
      case FilterType.startsWith:
        return (value: string) => value.indexOf(filterLowerCase) === 0;
      case FilterType.endsWith:
        return (value: string) => {
          const idx = value.lastIndexOf(filterLowerCase);
          return idx >= 0 && idx === value.length - filterLowerCase.length;
        }

      // ----- List Filters ----- //
      case FilterType.isContainedIn:
        return this.getListFilter(filter, true);
      case FilterType.isNotContainedIn:
        return this.getListFilter(filter, false);
    
      // ----- Should Never Happen ----- //
      default:
        console.warn('invalid filter type' + filter);
        break;
    }
    return;
  }

  private getListFilter(filter: string, isContainedIn: boolean) {
    const filterList = filter?.split(/[ ,]+/) || [];
    const valuePresenceTester = hashmapFromArray(filterList);
    return (value: string) => !!valuePresenceTester[value] == isContainedIn;
  }

  private onChange(value: Partial<CustomFilterModel>): void {
    this.setModel(Object.assign(this.currentModel, value));
    this.params?.filterChangedCallback();
  }
}
