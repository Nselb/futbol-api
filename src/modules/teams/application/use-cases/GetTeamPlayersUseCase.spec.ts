import { GetTeamPlayersUseCase } from './GetTeamPlayersUseCase';
import { NotFoundException } from '@nestjs/common';
import { Team } from '../../domain/entities/Team';
import { Player } from '../../../players/domain/entities/Player';
import { PlayerStatus } from '../../../players/domain/enums/PlayerStatus';

describe('GetTeamPlayersUseCase', () => {
  const mockTeamRepo = { findById: jest.fn(), save: jest.fn() };
  const mockPlayerRepo = {
    findByTeam: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };
  let useCase: GetTeamPlayersUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetTeamPlayersUseCase(
      mockTeamRepo as any,
      mockPlayerRepo as any,
    );
  });

  it('throws NotFoundException when team does not exist', async () => {
    mockTeamRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('team-1')).rejects.toThrow(NotFoundException);
  });

  it('returns playerIds for the team', async () => {
    mockTeamRepo.findById.mockResolvedValue(new Team('team-1', 'Rojo', []));
    mockPlayerRepo.findByTeam.mockResolvedValue([
      new Player('p-1', 'Juan', 10, 'team-1', PlayerStatus.PLAYING),
      new Player('p-2', 'Pedro', 7, 'team-1', PlayerStatus.BENCHED),
    ]);

    const result = await useCase.execute('team-1');

    expect(result).toEqual({ playerIds: ['p-1', 'p-2'] });
  });

  it('returns empty playerIds when team has no players', async () => {
    mockTeamRepo.findById.mockResolvedValue(new Team('team-1', 'Rojo', []));
    mockPlayerRepo.findByTeam.mockResolvedValue([]);

    const result = await useCase.execute('team-1');

    expect(result).toEqual({ playerIds: [] });
  });
});
