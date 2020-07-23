import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SocketService, UserEvent} from '../socket.service';
import {Message} from '../../../shared/models/message';
import {StorageService} from '../storage.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit {
  text: string;
  messages: Array<Message | UserEvent>;
  users: User[];
  @ViewChild('messageInput')
  messageInput: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private socketService: SocketService, private storage: StorageService) {
  }

  ngOnInit(): void {
    this.socketService.entered();

    this.socketService.onMessage().subscribe((message: Message) => this.messages.push(message));
    this.socketService.onUserEvent().subscribe((event: UserEvent) => this.messages.push(event));

    this.http.get('/messages').subscribe((messages: any[]) => {
      console.log(messages);
      this.messages = messages;
    });
    this.http.get('/users').subscribe((users: User[]) => {
      console.log(users);
      this.users = users;
    })
  }

  sendText(text: string): void {
    this.http.post('/messages', {userId: this.storage.getUserId(), text}).subscribe();
    this.text = '';
  }

  dmUser(user: User) {
    this.text = `@${user.name}: `;
    this.messageInput.nativeElement.focus()
  }

  logout() {
    this.storage.removeUserId();
  }
}
