import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5000', 'http://frontend:5000'],
    credentials: true,
  },
  namespace: '/events',
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinEvent')
  handleJoinEvent(@MessageBody() eventId: number, @ConnectedSocket() client: Socket) {
    client.join(`event_${eventId}`);
    console.log(`Client ${client.id} joined room event_${eventId}`);
  }

  sendAttendeeUpdate(eventId: number, attendeesCount: number) {
    this.server.to(`event_${eventId}`).emit('attendeesUpdated', {
      eventId,
      attendeesCount,
    });
  }
}
