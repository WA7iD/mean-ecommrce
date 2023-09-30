import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  token = JSON.parse(this.userService.getUserName()).token; // Replace with your authentication token if applicable

  constructor(
    private userService: UserService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.cartService.getCartItems(this.token).subscribe(
      (data) => {
        this.cartItems = data.data.products;
        console.log(this.cartItems);
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  addProductToCart(product: any) {
    this.cartService.addToCart(product, this.token).subscribe(
      () => {
        console.log('Product added to cart');
        // You can choose to refresh the cart items or display a success message
      },
      (error) => {
        console.error('Error adding product to cart', error);
        // Handle error (e.g., display an error message)
      }
    );
  }

  // You can implement other cart-related methods here

  calculateTotalPrice() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
  removeFromCart(e: any) {
    console.log('removed');
  }
  updateCartItem(e: any) {
    console.log('updated');
  }
}
