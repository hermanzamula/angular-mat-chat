import express, {Application, Request, Response, Router} from 'express';
import bodyParser from 'body-parser';
import {ChatRoute} from './chat.route';
import {createServer, Server} from 'http';
import {SocketIoService} from './socket-io.service';
import {ChatService} from './chat.service';

export class ChatServer {
  initialize(port: number) {
    const app: Application = express();
    app.use(bodyParser.json());
    app.use(express.static('../dist/material-chat'));

    const service: ChatService = new ChatService();

    const socketIoService: SocketIoService = new SocketIoService(service);

    const router: Router = Router();

    new ChatRoute(router, socketIoService, service);

    app.get('/', (req: Request, res: Response) => {
      res.sendFile('index.html');
    });
    app.use(router);

    const server: Server = createServer(app);
    server.listen(port);
    server.on('listening', () => console.log(`Chat Server started on port ${port}`));
    socketIoService.initialize(server);
  }
}
