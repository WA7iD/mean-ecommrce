import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AuthGuard } from './auth.gard';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BrandsComponent } from './brands/brands.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { CategoriesComponent } from './categories/categories.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard], // Protect the entire dashboard with a route guard
    children: [
      { path: 'add-category', component: AddCategoryComponent },
      { path: 'add-brand', component: AddBrandComponent },
      { path: 'add-product', component: AddProductComponent },
    ],
  },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent },

  { path: 'cart', component: CartComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
