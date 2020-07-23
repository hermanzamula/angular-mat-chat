import {User} from './user';

export interface Message {
  user: User;
  id: string;
  text: string;
  date: Date;
}
