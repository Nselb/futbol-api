import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from '../../../players/domain/repositories/IPlayerRepository';
import { EventType } from '../../domain/enums/EventType';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchesGateway } from '../../infrastructure/gateways/matches.gateway';
import { MatchResponseDto } from '../dtos/match-response.dto';
import { RegisterEventDto } from '../dtos/register-event.dto';
import { MatchMapper } from '../mappers/MatchMapper';

@Injectable()
export class RegisterEventUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private repository: IMatchRepository,
    @Inject(PLAYER_REPO_TOKEN) private playerRepository: IPlayerRepository,
    private readonly gateway: MatchesGateway,
  ) {}

  async execute(
    matchId: string,
    dto: RegisterEventDto,
  ): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    match.registerEvent(
      dto.playerId,
      dto.type,
      dto.minute ?? 0,
      dto.incomingPlayerId,
    );

    if (dto.type === EventType.SUBSTITUTION && dto.incomingPlayerId) {
      const [outgoing, incoming] = await Promise.all([
        this.playerRepository.findById(dto.playerId),
        this.playerRepository.findById(dto.incomingPlayerId),
      ]);
      if (!outgoing)
        throw new NotFoundException(`Player ${dto.playerId} not found`);
      if (!incoming)
        throw new NotFoundException(`Player ${dto.incomingPlayerId} not found`);

      outgoing.bench();
      incoming.play();

      await Promise.all([
        this.playerRepository.save(outgoing),
        this.playerRepository.save(incoming),
      ]);
    }

    await this.repository.save(match);
    const response = MatchMapper.toResponse(match);
    this.gateway.emitMatchUpdated(matchId, response);
    return response;
  }
}
