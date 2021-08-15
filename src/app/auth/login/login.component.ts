import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  error: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.error = '';
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(email, password).subscribe(response => {
        this.authService.user.next(response);
        this.router.navigate(['/dashboard']).finally();
      }, error => {
        this.error = error.error.message;
      }
    );
  }
}
