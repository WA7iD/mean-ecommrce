import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Import the UserService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  errorMessage!: string;
  loading: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private userService: UserService
  ) {}
  // login
  loginSubmit(lForm: FormGroup) {
    this.loading = true;

    this._AuthService.sendLogin(lForm.value).subscribe({
      next: (res) => {
        this.userService.setUserName(JSON.stringify(res));
        // Redirect to the dashboard or desired page upon successful login.
        this._Router.navigate(['/home']);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.loading = false;
      },
    });
  }
}
