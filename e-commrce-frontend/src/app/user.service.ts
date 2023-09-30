import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private storageKey = 'user';

  setUserName(name: string) {
    localStorage.setItem(this.storageKey, name);
  }

  getUserName() {
    return localStorage.getItem(this.storageKey) || '';
  }
}
