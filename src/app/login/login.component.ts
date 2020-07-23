import {Component, EventEmitter, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output()
  entered = new EventEmitter();
  showSpinner = false;
  username: string = '';

  constructor(private http: HttpClient, private storage: StorageService) {
  }


  onLogin() {
    this.http.post('/users', {name: this.username}).subscribe({
      next: (userData: any) => {
        this.storage.setUserId(userData.id);
        this.entered.emit();
      }
    });
  }
}
