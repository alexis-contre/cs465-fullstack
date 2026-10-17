import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  formError = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

  public onLoginSubmit(): void {
    this.formError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
      return;
    }

    this.authenticationService
      .login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },

        error: (error: any) => {
          console.log('LOGIN ERROR:', error);

          this.formError = error?.error?.message || 'Unable to log in.';
        },
      });
  }
}
