import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrandsComponent } from './brands/brands.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { AddProductComponent } from './add-product/add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BrandsComponent,
    ProductsComponent,
    CategoriesComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    NotfoundComponent,
    ProductDetailComponent,
    AdminDashboardComponent,
    SidebarComponent,
    AddCategoryComponent,
    AddBrandComponent,
    AddProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot(),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
