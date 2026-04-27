import { RegisterLineupUseCase } from './RegisterLineupUseCase';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Team } from '../../domain/entities/Team';
import { Player } from 'src/modules/players/domain/entities/Player';
import { PlayerStatus } from 'src/modules/players/domain/enums/PlayerStatus';

const makePlayer = (
  id: string,
  teamId = 'team-1',
  status = PlayerStatus.BENCHED,
) => new Player(id, 'Player', 10, teamId, status);

const SEVEN_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];

describe('RegisterLineupUseCase', () => {
  const mockTeamRepo = { findById: jest.fn(), save: jest.fn() };
  const mockPlayerRepo = {
    findById: jest.fn(),
    save: jest.fn(),
    findByTeam: jest.fn(),
  };
  let useCase: RegisterLineupUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterLineupUseCase(
      mockTeamRepo as any,
      mockPlayerRepo as any,
    );
  });

  it('throws BadRequestException when fewer than 7 player IDs are provided', async () => {
    await expect(
      useCase.execute('team-1', ['p1', 'p2']),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when more than 7 player IDs are provided', async () => {
    await expect(
      useCase.execute('team-1', [...SEVEN_IDS, 'p8']),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException when team does not exist', async () => {
    mockTeamRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('team-1', SEVEN_IDS)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws NotFoundException when a player does not exist', async () => {
    mockTeamRepo.findById.mockResolvedValue(new Team('team-1', 'Rojo', []));
    mockPlayerRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('team-1', SEVEN_IDS)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws BadRequestException when a player belongs to a different team', async () => {
    mockTeamRepo.findById.mockResolvedValue(new Team('team-1', 'Rojo', []));
    mockPlayerRepo.findById.mockResolvedValue(
      makePlayer('p1', 'other-team'),
    );
    await expect(useCase.execute('team-1', SEVEN_IDS)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws BadRequestException when a player is already PLAYING', async () => {
    mockTeamRepo.findById.mockResolvedValue(new Team('team-1', 'Rojo', []));
    mockPlayerRepo.findById.mockResolvedValue(
      makePlayer('p1', 'team-1', PlayerStatus.PLAYING),
    );
    await expect(useCase.execute('team-1', SEVEN_IDS)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('sets all 7 players to PLAYING and returns their IDs', async () => {
    mockTeamRepo.findById.mockResolvedValue(new Team('team-1', 'Rojo', []));
    mockPlayerRepo.findById.mockImplementation((id: string) =>
      Promise.resolve(makePlayer(id, 'team-1')),
    );
    mockPlayerRepo.save.mockImplementation((p: Player) => Promise.resolve(p));

    const result = await useCase.execute('team-1', SEVEN_IDS);

    expect(mockPlayerRepo.save).toHaveBeenCalledTimes(7);
    const savedPlayers: Player[] = mockPlayerRepo.save.mock.calls.map(
      (c: [Player]) => c[0],
    );
    savedPlayers.forEach((p) =>
      expect(p.status).toBe(PlayerStatus.PLAYING),
    );
    expect(result).toEqual({ playerIds: SEVEN_IDS });
  });
});
