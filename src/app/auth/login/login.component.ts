import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Alert } from '../../shared/alert/alert.model';
import { AlertType } from '../../shared/alert/alert-type.enum';
import { AlertService } from '../../shared/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private authService: AuthService, private alertService: AlertService, private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin(): void {
    // Reset messages
    this.alertService.alertSubject.next(new Alert(`Processing login credentials..`, AlertType.INFO));

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(email, password).subscribe(
      response => {
        response.password = password;
        localStorage.setItem('user', JSON.stringify(response));
        this.authService.user.next(response);
        this.alertService.alertSubject.next(new Alert(`Successfully authenticated your account.`, AlertType.SUCCESS));
        this.router.navigate(['/dashboard']).finally();
      }, error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      }
    );
  }
}
