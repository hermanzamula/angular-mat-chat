import {Message} from '../shared/models/message';
import {User} from '../shared/models/user';


export interface Storage {
  users: User[];
  messages: Message[];
}

export class ChatService {
  private readonly storage: Storage;

  constructor() {
    this.storage = {users: [], messages: []};
  }

  getMessages(): Message[] {
    return this.storage.messages;
  }

  saveMessage(userId: string, text: string): Message {
    if (typeof userId === 'undefined') {
      throw new Error('User id is not defined');
    }
    if (typeof text === 'undefined' || text.trim().length === 0) {
      throw new Error(`"text" should be defined and not empty`);
    }

    const user: User = this.storage.users.find(user => user.id === userId);
    if (typeof user === 'undefined') {
      throw new Error(`User with id ${userId} not found`);
    }

    const message: Message = {text, user, id: Math.random().toString(), date: new Date()};
    this.storage.messages.push(message);
    return message;
  }

  addUser(name: string): User {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('User name should be defined and not be empty.');
    }

    const user: User = {id: Math.random().toString(), name};
    this.storage.users.push(user);
    return user;
  }

  getUsers(): User[] {
    return this.storage.users;
  }

  getUser(id: string): User {
    return this.getUsers().find(u => u.id === id);
  }
}
