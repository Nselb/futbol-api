import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchResponseDto } from '../../application/dtos/match-response.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MatchesGateway.name);

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('match:join')
  async handleJoin(
    @MessageBody() matchId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`match:${matchId}`);
    client.emit('match:joined', { matchId });
    this.logger.log(`Client ${client.id} joined match:${matchId}`);
  }

  @SubscribeMessage('match:leave')
  async handleLeave(
    @MessageBody() matchId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(`match:${matchId}`);
    this.logger.log(`Client ${client.id} left match:${matchId}`);
  }

  emitMatchUpdated(matchId: string, data: MatchResponseDto) {
    this.server.to(`match:${matchId}`).emit('match:updated', data);
  }
}
