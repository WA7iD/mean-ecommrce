import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sliderImages: string[] = [
    'https://i.pinimg.com/736x/b6/89/96/b68996b0aeb13339740f961ada455a77.jpg',
    'https://images.vexels.com/content/194700/preview/buy-online-slider-template-4261dd.png',
    'https://lmswebsiteservices.com/images/ECommerce%20Web%20Design%20Slider.jpg',
  ];
  categories: any[] = [];
  products: any[] = [];
  brands: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('http://localhost:8000/api/v1/categories')
      .subscribe((data: any) => {
        // Assuming the API response is an array of category objects
        this.categories = data.data.slice(0, 5); // Display the first 5 categories
      });

    this.http
      .get('http://localhost:8000/api/v1/products')
      .subscribe((data: any) => {
        // Assuming the API response is an array of product objects
        this.products = data.data.slice(0, 8);
      });
    this.http
      .get('http://localhost:8000/api/v1/brands')
      .subscribe((data: any) => {
        // Assuming the API response is an array of product objects
        this.brands = data.data;
      });
  }
}
