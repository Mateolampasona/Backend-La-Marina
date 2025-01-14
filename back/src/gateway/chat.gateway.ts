import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors:{
        origin:"*"
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server:Server

    handleConnection(client:Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(client:Socket, payload: any):void{
        console.log(`Mesaje recibido de ${client.id}`, payload)
        this.server.emit("message",payload)
}
}