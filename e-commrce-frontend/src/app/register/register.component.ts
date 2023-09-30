import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  errorMessage!: string;
  loading: boolean = false;

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z]/),
      ]),
      passwordConfirm: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z]/),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(01)[0125][0-9]{8}$/),
      ]),
    },
    this.validatePassword
  );

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  validatePassword(g: any) {
    return g.get('password').value === g.get('passwordConfirm').value
      ? null
      : { mismatch: true };
  }

  // register
  registerSubmit(rForm: FormGroup) {
    this.loading = true;

    this._AuthService.sendRegister(rForm.value).subscribe({
      next: (res) => {
        // lw el donia tama ==> login
        // programming routing
        this._Router.navigate(['/login']);
        this.loading = false;
      },

      error: (err) => {
        this.errorMessage = err.error.message;
        this.loading = false;
      },
    });
  }
}
