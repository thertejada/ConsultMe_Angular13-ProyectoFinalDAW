import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditOrderComponent } from './new-edit-order.component';

describe('NewOrderComponent', () => {
  let component: NewEditOrderComponent;
  let fixture: ComponentFixture<NewEditOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewEditOrderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
