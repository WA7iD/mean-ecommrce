import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent {
  brands: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('http://localhost:8000/api/v1/brands')
      .subscribe((data: any) => {
        // Assuming the API response is an array of product objects
        this.brands = data.data;
      });
  }
}
