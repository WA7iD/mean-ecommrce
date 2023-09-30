import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http
      .get('http://localhost:8000/api/v1/products')
      .subscribe((data: any) => {
        // Assuming the API response is an array of product objects
        this.products = data.data;
      });
  }
}
