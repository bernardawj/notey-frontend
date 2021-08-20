import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let debugElement: DebugElement;

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      fixture.componentInstance.ngOnInit();
    });
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with login form', () => {
    let loginForm: FormGroup = component.loginForm;

    expect(loginForm).toBeTruthy();
    expect(loginForm.contains('email')).toBeTrue();
    expect(loginForm.contains('password')).toBeTrue();
  });

  it('should be invalid if email and password is empty', () => {
    let loginForm: FormGroup = component.loginForm;
    let email: string = loginForm.get('email')?.value;
    let password: string = loginForm.get('password')?.value;

    expect(email).toBe('');
    expect(password).toBe('');
    expect(loginForm.invalid).toBeTrue();
  });

  it('should display validation message if email is empty', () => {
    let loginForm: FormGroup = component.loginForm;
    let email: string = loginForm.get('email')?.value;
    let control: FormControl = <FormControl>loginForm.get('email');
    control.markAsDirty();
    control.setValue('weird')

    expect(email).toBe('');
    expect(control.errors?.required).toBeTruthy();
  });

  // it('should login when button is clicked', fakeAsync(() => {
  //   spyOn(component, 'onLogin');
  //
  //
  //   let button = debugElement.nativeElement.querySelector('button');
  //   button.click();
  //   tick();
  //
  //   expect(component.onLogin).toHaveBeenCalled();
  // }));
});
