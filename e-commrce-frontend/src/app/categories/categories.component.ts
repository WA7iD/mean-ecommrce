import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  categories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('http://localhost:8000/api/v1/categories')
      .subscribe((data: any) => {
        // Assuming the API response is an array of category objects
        this.categories = data.data; // Display the first 5 categories
      });
  }
}
