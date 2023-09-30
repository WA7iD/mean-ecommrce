import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    // Check the user's role (e.g., 'admin') here
    if (JSON.parse(this.userService.getUserName()).data.role === 'admin') {
      return true; // Allow access
    } else {
      // Redirect to another page or show an error message
      this.router.navigate(['/home']);
      return false; // Deny access
    }
  }
}
