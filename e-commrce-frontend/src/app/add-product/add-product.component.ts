import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  addProductForm: FormGroup;
  brands: any[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private http: HttpClient
  ) {
    this.addProductForm = this.fb.group({
      prodName: ['', Validators.required],
      prodDescription: ['', Validators.required],
      priceBefore: ['', Validators.required],
      priceAfter: [''], // Optional field
      qty: ['', Validators.required],
      CatID: ['', Validators.required],
      BrandID: ['', Validators.required],
      images: this.fb.array([]), // Array for selected images
    });
  }
  ngOnInit() {
    this.http
      .get('http://localhost:8000/api/v1/brands')
      .subscribe((data: any) => {
        // Assuming the API response is an array of product objects
        this.brands = data.data;
      });
    this.http
      .get('http://localhost:8000/api/v1/categories')
      .subscribe((data: any) => {
        // Assuming the API response is an array of category objects
        this.categories = data.data; // Display the first 5 categories
      });
  }
  // Getters for form controls
  get prodNameControl() {
    return this.addProductForm.get('prodName');
  }

  get prodDescriptionControl() {
    return this.addProductForm.get('prodDescription');
  }

  get priceBeforeControl() {
    return this.addProductForm.get('priceBefore');
  }

  get priceAfterControl() {
    return this.addProductForm.get('priceAfter');
  }

  get qtyControl() {
    return this.addProductForm.get('qty');
  }

  get catIdControl() {
    return this.addProductForm.get('CatID');
  }

  get brandIdControl() {
    return this.addProductForm.get('BrandID');
  }

  get selectedColorsControl() {
    return this.addProductForm.get('selectedColors');
  }

  get imagesControl() {
    return this.addProductForm.get('images') as FormArray;
  }
  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.imagesControl.push(this.fb.control(file));
      }
    }
  }

  handleSubmit() {
    if (this.addProductForm.invalid) {
      // Handle form validation errors
      return;
    }

    // Prepare form data and send it to the ProductService for API call
    console.log(this.imagesControl!.value);
    const formData = new FormData();
    formData.append('title', this.prodNameControl!.value);
    formData.append('description', this.prodDescriptionControl!.value);
    formData.append('price', this.priceBeforeControl!.value);
    formData.append('priceAfterDiscount', this.priceAfterControl!.value);
    formData.append('quantity', this.qtyControl!.value);
    formData.append('category', this.catIdControl!.value);
    formData.append('brand', this.brandIdControl!.value);
    formData.append(
      'imageCover',
      this.imagesControl!.value[this.imagesControl!.value.length]
    );
    // Add selected images to formData (assuming images is an array of File objects)
    this.imagesControl!.value.forEach((image: any) => {
      formData.append('images', image);
    });

    // Call the createProduct method in the ProductService
    this.productService.createProduct(formData).subscribe(
      (response: any) => {
        // Handle success
        console.log(response);
      },
      (error: any) => {
        // Handle error
        console.error(error);
      }
    );
  }
}
