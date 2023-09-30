import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  constructor(private userService: UserService) {}

  isAdmin(): boolean {
    // Check if the user has the "admin" role
    return JSON.parse(this.userService.getUserName()).data.role === 'admin';
  }
}
