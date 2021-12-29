import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFilter } from './custom-filter.component';

describe('CustomFilterComponent', () => {
  let component: CustomFilter;
  let fixture: ComponentFixture<CustomFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomFilter],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
