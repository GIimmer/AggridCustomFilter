import { Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, IFilterParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { hashmapFromArray } from 'src/app/utils/general.utils';
import { SubSink } from 'subsink';

export interface CustomFilterModel {
  type: string;
  filter: string;
}

export enum TableColFilterType {
  contains = 'Contains',
  notContains = 'Not Contains',
  equals = 'Equals',
  notEquals = 'Not Equals',
  startsWith = 'Starts With',
  endsWith = 'Ends With',
  isContainedIn = 'Is Contained in',
  isNotContainedIn = 'Is Not Contained In',
}

@Component({
  selector: 'app-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss'],
})
export class CustomFilterComponent implements IFilterAngularComp, OnDestroy {
  public filterTypes: string[] = Object.values(TableColFilterType);
  public filterType = new FormControl(TableColFilterType.contains);
  public filter = new FormControl('');

  private params: IFilterParams | undefined;
  private subs: SubSink = new SubSink();

  private checkValuePassesFilter: ((val: string) => boolean) | undefined;
  private valueAccessor: ((data: IDoesFilterPassParams) => string) | undefined;
  private currentModel: CustomFilterModel = { type: '', filter: '' };

  @ViewChild('input', { read: ViewContainerRef }) public input: any;

  agInit(params: IFilterParams): void {
    this.params = params;
    this.subs.sink = this.filter.valueChanges.subscribe((filter: string) => this.onChange({ filter }));
    this.subs.sink = this.filterType.valueChanges.subscribe((type: TableColFilterType) => this.onChange({ type }));
    this.filterType.setValue(this.filterTypes[0]);

    const colId = params.colDef.field as string;
    this.valueAccessor = (params: IDoesFilterPassParams) => params.data[colId];
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    window.setTimeout(() => this.input.element.nativeElement.focus());
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

  private getValueTester(type: TableColFilterType, filter: string) {
    const filterLowerCase = filter.toString().toLowerCase();

    switch (type) {
      // ----- Standard Filters ----- //
      case TableColFilterType.contains:
        return (value: string) => value.indexOf(filterLowerCase) >= 0;
      case TableColFilterType.notContains:
        return (value: string) => value.indexOf(filterLowerCase) === -1;
      case TableColFilterType.equals:
        return (value: string) => value === filterLowerCase;
      case TableColFilterType.notEquals:
        return (value: string) => value != filterLowerCase;
      case TableColFilterType.startsWith:
        return (value: string) => value.indexOf(filterLowerCase) === 0;
      case TableColFilterType.endsWith:
        return (value: string) => {
          const idx = value.lastIndexOf(filterLowerCase);
          return idx >= 0 && idx === value.length - filterLowerCase.length;
        };

      // ----- List Filters ----- //
      case TableColFilterType.isContainedIn:
        return this.getListFilter(filter, true);
      case TableColFilterType.isNotContainedIn:
        return this.getListFilter(filter, false);

      // ----- Should Never Happen ----- //
      default:
        console.warn('invalid filter type ' + filter);
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
