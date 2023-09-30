import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface RegisterInterface {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

interface LoginInterface {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'http://localhost:8000';

  constructor(private _HttpClient: HttpClient) {}

  sendRegister(registerData: RegisterInterface): Observable<any> {
    console.log(registerData);
    return this._HttpClient.post(
      this.baseUrl + '/api/v1/auth/signup',
      registerData
    );
  }

  sendLogin(loginData: LoginInterface): Observable<any> {
    console.log(loginData);
    return this._HttpClient.post(
      this.baseUrl + '/api/v1/auth/login',
      loginData
    );
  }
}
