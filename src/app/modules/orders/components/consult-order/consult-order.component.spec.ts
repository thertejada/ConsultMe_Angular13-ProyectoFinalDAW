import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultOrderComponent } from './consult-order.component';

describe('ConsultOrderComponent', () => {
  let component: ConsultOrderComponent;
  let fixture: ComponentFixture<ConsultOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
