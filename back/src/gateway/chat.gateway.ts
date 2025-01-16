import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.setMaxListeners(20); // Aumenta el límite de listeners permitidos
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.setMaxListeners(20); // Aumenta el límite de listeners permitidos para cada cliente
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    console.log(`Message received from ${client.id}`, payload);
    this.server.emit('message', payload);
  }
}
