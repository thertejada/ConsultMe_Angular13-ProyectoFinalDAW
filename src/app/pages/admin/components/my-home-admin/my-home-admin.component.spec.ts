import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHomeAdminComponent } from './my-home-admin.component';

describe('MyHomeAdminComponent', () => {
  let component: MyHomeAdminComponent;
  let fixture: ComponentFixture<MyHomeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyHomeAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHomeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
