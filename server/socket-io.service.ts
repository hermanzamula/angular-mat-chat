import {Server} from 'http';
import io, {Namespace, Server as ServerIO, Socket} from 'socket.io';
import {Message} from '../shared/models/message';
import {ChatService} from './chat.service';
import {User} from '../shared/models/user';

export class SocketIoService {
  private socketServer: ServerIO;
  private namespace: Namespace;
  private loggedUserConnections: Map<string, User> = new Map();

  constructor(private chatService: ChatService) {
  }

  initialize(server: Server) {
    this.socketServer = io(server);

    this.namespace = this.socketServer.of('/chat');

    this.namespace.on('connect', () => console.log('connected'));

    this.namespace.on('connection', (socket: Socket) => {
      console.log('socket connection', socket.id);
      let loggedUser: User;

      socket.once('enter', (user: string) => {
        console.log('Entered ' + user);
        loggedUser = this.chatService.getUser(user);

        if(loggedUser === undefined) {
          socket.emit('loggedout');
          return;
        }

        if (!this.loggedUserConnections.has(loggedUser.id)) {
          this.loggedUserConnections.set(loggedUser.id, loggedUser);
          this.namespace.emit('entered', loggedUser.name);
        }
      });
    });
  }

  messageSent(message: Message) {
    this.namespace.emit('message', message);
  }

  userLeft(user: User) {
    this.namespace.emit('left', user.name);
  }
}
