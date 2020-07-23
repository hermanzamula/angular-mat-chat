import {Injectable} from '@angular/core';

const key = 'appUserId';

@Injectable({providedIn: 'root'})
export class StorageService {
  setUserId(userId: string) {
    localStorage.setItem(key, userId);
  }

  getUserId() {
    return localStorage.getItem(key);
  }

  removeUserId() {
    return localStorage.removeItem(key);
  }
}
