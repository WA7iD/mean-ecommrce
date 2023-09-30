import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productId!: string;
  product: any; // Define the product data structure

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Get the product ID from the route parameter
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      console.log(this.productId);
      // Fetch product details based on the ID from your API
      this.http
        .get(`http://localhost:8000/api/v1/products/${this.productId}`)
        .subscribe(
          (data: any) => {
            // Store the product data
            this.product = data.data;
          },
          (error) => {
            console.error('Error fetching product data', error);
          }
        );
    });
  }
  addToCart() {
    console.log('addedd to cart');
  }
}
