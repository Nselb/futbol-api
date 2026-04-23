import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchResponseDto } from '../../application/dtos/match-response.dto';

@WebSocketGateway({})
export class MatchesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('match:join')
  async handleJoin(
    @MessageBody() matchId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`match:${matchId}`);
    client.emit('match:joined', { matchId });
  }

  @SubscribeMessage('match:leave')
  async handleLeave(
    @MessageBody() matchId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(`match:${matchId}`);
  }

  emitMatchUpdated(matchId: string, data: MatchResponseDto) {
    this.server.to(`match:${matchId}`).emit('match:updated', data);
  }
}
