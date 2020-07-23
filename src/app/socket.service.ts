import {Injectable} from '@angular/core';
import io from 'socket.io-client';
import {Observable, Subject} from 'rxjs';
import {Message} from '../../shared/models/message';
import {StorageService} from './storage.service';

export interface UserEvent {
  name: 'entered' | 'left';
  username: string;
}

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;
  private messageSubject = new Subject<Message>();
  private userEventSubject = new Subject<UserEvent>()

  constructor(private storage: StorageService) {
    this.socket = io.connect().io.socket('/chat');
  }

  entered(): void {
    this.socket.on('loggedout', () => {
      console.log('loggedout');
      this.storage.removeUserId();
    })
    this.socket.emit('enter', this.storage.getUserId());
    this.socket.on('entered', (username: string) => {
      console.log(username);
      this.userEventSubject.next({name: 'entered', username})
    });
    this.socket.on('left', (username: string) => {
      console.log(username);
      this.userEventSubject.next({name: 'left', username})
    });
    this.socket.on('message', (message: Message) => {
      console.log(message);
      this.messageSubject.next(message);
    });
  }

  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  onUserEvent(): Observable<UserEvent>  {
    return this.userEventSubject.asObservable();
  }
}
