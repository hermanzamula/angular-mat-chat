import {Component} from '@angular/core';
import {StorageService} from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'material-chat';

  constructor(private storage: StorageService) {
  }

  isLoggedIn(): boolean {
    return !!this.storage.getUserId();
  }
}
