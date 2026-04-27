import { FinishMatchUseCase } from './FinishMatchUseCase';
import { NotFoundException } from '@nestjs/common';
import { Match } from '../../domain/entities/Match';
import { MatchStatus } from '../../domain/enums/MatchStatus';
import { TimeInterval } from '../../domain/entities/TimeInterval';
import { Player } from 'src/modules/players/domain/entities/Player';
import { PlayerStatus } from 'src/modules/players/domain/enums/PlayerStatus';

describe('FinishMatchUseCase', () => {
  const mockMatchRepo = { findById: jest.fn(), save: jest.fn() };
  const mockGateway = { emitMatchUpdated: jest.fn() };
  const mockPlayerRepo = {
    findByTeam: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };
  let useCase: FinishMatchUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FinishMatchUseCase(
      mockMatchRepo as any,
      mockGateway as any,
      mockPlayerRepo as any,
    );
  });

  it('throws NotFoundException when match does not exist', async () => {
    mockMatchRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('match-1')).rejects.toThrow(NotFoundException);
  });

  it('benches all players of both teams after finishing', async () => {
    const match = Match.reconstitute({
      id: 'match-1',
      homeTeamId: 'team-home',
      awayTeamId: 'team-away',
      status: MatchStatus.IN_PROGRESS,
      half: 2,
      intervals: [new TimeInterval('int-1', 'match-1', 2, new Date(), null)],
      events: [],
      createdAt: new Date(),
    });
    mockMatchRepo.findById.mockResolvedValue(match);
    mockMatchRepo.save.mockResolvedValue(match);

    const homePlayers = [
      new Player('p1', 'A', 1, 'team-home', PlayerStatus.PLAYING),
      new Player('p2', 'B', 2, 'team-home', PlayerStatus.PLAYING),
    ];
    const awayPlayers = [
      new Player('p3', 'C', 3, 'team-away', PlayerStatus.PLAYING),
    ];
    mockPlayerRepo.findByTeam.mockImplementation((teamId: string) =>
      Promise.resolve(teamId === 'team-home' ? homePlayers : awayPlayers),
    );
    mockPlayerRepo.save.mockImplementation((p: Player) => Promise.resolve(p));

    await useCase.execute('match-1');

    expect(mockPlayerRepo.findByTeam).toHaveBeenCalledWith('team-home');
    expect(mockPlayerRepo.findByTeam).toHaveBeenCalledWith('team-away');
    expect(mockPlayerRepo.save).toHaveBeenCalledTimes(3);
    expect(homePlayers[0].status).toBe(PlayerStatus.BENCHED);
    expect(homePlayers[1].status).toBe(PlayerStatus.BENCHED);
    expect(awayPlayers[0].status).toBe(PlayerStatus.BENCHED);
  });
});
