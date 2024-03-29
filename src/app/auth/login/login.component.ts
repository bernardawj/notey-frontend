import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Alert } from '../../shared/alert/alert.model';
import { AlertType } from '../../shared/alert/alert-type.enum';
import { AlertService } from '../../shared/alert/alert.service';
import { Login } from '../../model/auth/login.model';
import { Token } from '../../model/auth/token.model';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: UntypedFormGroup;

  constructor(private authService: AuthService, private alertService: AlertService, private formBuilder: UntypedFormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required])
    });
  }

  onLogin(): void {
    // Reset messages
    this.alertService.alertSubject.next(new Alert(`Processing login credentials..`, AlertType.INFO));

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(new Login(email, password)).subscribe(
      auth => {
        localStorage.setItem('auth', JSON.stringify(auth));
        this.authService.auth.next(auth);
        this.alertService.alertSubject.next(new Alert(`Successfully authenticated your account.`, AlertType.SUCCESS));
        this.router.navigate(['/dashboard']).finally();
      }, error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      }
    );
  }
}
