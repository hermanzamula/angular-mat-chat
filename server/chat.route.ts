import {Request, Response, Router} from 'express';
import {ChatService} from './chat.service';
import {SocketIoService} from './socket-io.service';


export class ChatRoute {
  constructor(router: Router, private socketIoService: SocketIoService, private service: ChatService) {
    router.get('/messages', this.getMessages.bind(this));
    router.post('/messages', this.saveMessage.bind(this));
    router.get('/users', this.getUsers.bind(this));
    router.post('/users', this.addUser.bind(this));
    router.post('/logout', this.logout.bind(this));
  }

  getMessages(req: Request, res: Response) {
    return res.status(200).json(this.service.getMessages());
  }

  saveMessage(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const text = req.body.text;
      const message = this.service.saveMessage(userId, text);
      res.status(201).json(message);
      this.socketIoService.messageSent(message);
    } catch (error) {
      console.log(error);
      return res.status(400).json({error: error.message});
    }
  }

  addUser(req: Request, res: Response) {
    try {
      return res.status(201).json(this.service.addUser(req.body.name));
    } catch (error) {
      return res.status(400).json({error: error.message});
    }
  }

  getUsers(req: Request, res: Response) {
    return res.status(200).json(this.service.getUsers());
  }

  logout(req: Request, res: Response) {
    const user = this.service.getUser(req.params.id);
    this.socketIoService.userLeft(user);
    return res.status(200).send();
  }
}
