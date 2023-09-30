import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private userService: UserService) {}

  createProduct(formData: FormData): Observable<any> {
    const token = JSON.parse(this.userService.getUserName()).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const options = { headers: headers };
    return this.http.post(
      `http://localhost:8000/api/v1/products`,
      formData,
      options
    );
  }
}
