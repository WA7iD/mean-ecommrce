import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private userService: UserService, private _Router: Router) {}

  getUserName() {
    try {
      const myData = JSON.parse(this.userService.getUserName());
      return myData.data.name;
    } catch (error) {
      // Handle the error, e.g., return null or an empty string
      return '';
    }
  }
  signOut() {
    this.userService.setUserName('');
    localStorage.removeItem('user');

    this._Router.navigate(['/login']);
  }
  isUserAdmin(): boolean {
    if (JSON.parse(this.userService.getUserName()).data.role === 'admin') {
      return true; // Allow access
    } else {
      return false;
    }
  }
}
