import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent {
  addCategoryForm: FormGroup;
  selectedImage: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    this.addCategoryForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      image: ['ss', [Validators.required]],
    });
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedImage = inputElement.files[0];
    }
  }

  onSubmit() {
    console.log('before go');
    console.log(this.addCategoryForm.valid);
    console.log('Form Value:', this.addCategoryForm.value);
    console.log(this.selectedImage);
    if (this.addCategoryForm.valid && this.selectedImage) {
      console.log('test');
      const formData = new FormData();
      formData.append('name', this.addCategoryForm.get('title')!.value);
      formData.append('image', this.selectedImage);

      const headers = new HttpHeaders({
        Authorization: `Bearer ${
          JSON.parse(this.userService.getUserName()).token
        }`,
      });

      this.http
        .post('http://localhost:8000/api/v1/categories', formData, { headers })
        .subscribe(
          (response) => {
            // Handle success, e.g., display a success message
            console.log('Category created successfully');
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            // Handle error, e.g., display an error message
            console.error('Error creating category:', error);
          }
        );
    }
  }
}
