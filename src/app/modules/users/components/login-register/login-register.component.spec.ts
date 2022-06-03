import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegistarComponent } from './login-register.component';

describe('LoginComponent', () => {
  let component: LoginRegistarComponent;
  let fixture: ComponentFixture<LoginRegistarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginRegistarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegistarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
