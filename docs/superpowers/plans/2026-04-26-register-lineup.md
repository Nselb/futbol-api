# Register Lineup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add player lineup registration for a team (7 players → PLAYING), expose team player IDs endpoint, and auto-bench all players when a match finishes.

**Architecture:** Three independent changes following existing Clean Architecture patterns — domain method additions on `Player`, two new use cases in `TeamsModule`, and an enrichment of `FinishMatchUseCase` in `MatchesModule` to reset player statuses.

**Tech Stack:** NestJS, TypeScript, Prisma, Jest, class-validator

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/modules/players/domain/entities/Player.ts` | Modify | Add `play()` and `bench()` domain methods |
| `src/modules/players/domain/entities/Player.spec.ts` | Create | Unit tests for new Player methods |
| `src/modules/teams/application/use-cases/GetTeamPlayersUseCase.ts` | Create | Return `{ playerIds }` for a team |
| `src/modules/teams/application/use-cases/GetTeamPlayersUseCase.spec.ts` | Create | Unit tests |
| `src/modules/teams/application/dtos/register-lineup.dto.ts` | Create | DTO validating exactly 7 UUIDs |
| `src/modules/teams/application/use-cases/RegisterLineupUseCase.ts` | Create | Validate + set 7 players to PLAYING |
| `src/modules/teams/application/use-cases/RegisterLineupUseCase.spec.ts` | Create | Unit tests |
| `src/modules/teams/presentation/teams.controller.ts` | Modify | Add `GET /:id/players` and `POST /:id/lineup` |
| `src/modules/teams/teams.module.ts` | Modify | Register two new use cases |
| `src/modules/matches/application/use-cases/FinishMatchUseCase.ts` | Modify | Inject player repo, bench players after finish |
| `src/modules/matches/application/use-cases/FinishMatchUseCase.spec.ts` | Create | Unit tests |
| `src/modules/matches/matches.module.ts` | Modify | Import PlayersModule for player repo access |

---

## Task 1: Player domain methods (`play` / `bench`)

**Files:**
- Modify: `src/modules/players/domain/entities/Player.ts`
- Create: `src/modules/players/domain/entities/Player.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/modules/players/domain/entities/Player.spec.ts`:

```typescript
import { Player } from './Player';
import { PlayerStatus } from '../enums/PlayerStatus';

const makePlayer = () => new Player('id-1', 'Juan', 10, null, PlayerStatus.BENCHED);

describe('Player', () => {
  describe('play()', () => {
    it('sets status to PLAYING', () => {
      const player = makePlayer();
      player.play();
      expect(player.status).toBe(PlayerStatus.PLAYING);
    });
  });

  describe('bench()', () => {
    it('sets status to BENCHED', () => {
      const player = makePlayer();
      player.play();
      player.bench();
      expect(player.status).toBe(PlayerStatus.BENCHED);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest Player.spec.ts --no-coverage
```

Expected: FAIL — `player.play is not a function`

- [ ] **Step 3: Add `play()` and `bench()` to Player entity**

In `src/modules/players/domain/entities/Player.ts`, add after `assignTeam()`:

```typescript
play(): void {
  this.status = PlayerStatus.PLAYING;
}

bench(): void {
  this.status = PlayerStatus.BENCHED;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest Player.spec.ts --no-coverage
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/modules/players/domain/entities/Player.ts src/modules/players/domain/entities/Player.spec.ts
git commit -m "feat: add play() and bench() domain methods to Player"
```

---

## Task 2: GetTeamPlayersUseCase

**Files:**
- Create: `src/modules/teams/application/use-cases/GetTeamPlayersUseCase.ts`
- Create: `src/modules/teams/application/use-cases/GetTeamPlayersUseCase.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/modules/teams/application/use-cases/GetTeamPlayersUseCase.spec.ts`:

```typescript
import { GetTeamPlayersUseCase } from './GetTeamPlayersUseCase';
import { NotFoundException } from '@nestjs/common';
import { Team } from '../../domain/entities/Team';
import { Player } from 'src/modules/players/domain/entities/Player';
import { PlayerStatus } from 'src/modules/players/domain/enums/PlayerStatus';

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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest GetTeamPlayersUseCase.spec.ts --no-coverage
```

Expected: FAIL — `Cannot find module './GetTeamPlayersUseCase'`

- [ ] **Step 3: Implement GetTeamPlayersUseCase**

Create `src/modules/teams/application/use-cases/GetTeamPlayersUseCase.ts`:

```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from 'src/modules/players/domain/repositories/IPlayerRepository';

@Injectable()
export class GetTeamPlayersUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(teamId: string): Promise<{ playerIds: string[] }> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');

    const players = await this.playerRepository.findByTeam(teamId);
    return { playerIds: players.map((p) => p.id) };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest GetTeamPlayersUseCase.spec.ts --no-coverage
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/modules/teams/application/use-cases/GetTeamPlayersUseCase.ts src/modules/teams/application/use-cases/GetTeamPlayersUseCase.spec.ts
git commit -m "feat: add GetTeamPlayersUseCase"
```

---

## Task 3: RegisterLineupUseCase

**Files:**
- Create: `src/modules/teams/application/dtos/register-lineup.dto.ts`
- Create: `src/modules/teams/application/use-cases/RegisterLineupUseCase.ts`
- Create: `src/modules/teams/application/use-cases/RegisterLineupUseCase.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/modules/teams/application/use-cases/RegisterLineupUseCase.spec.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest RegisterLineupUseCase.spec.ts --no-coverage
```

Expected: FAIL — `Cannot find module './RegisterLineupUseCase'`

- [ ] **Step 3: Create RegisterLineupDto**

Create `src/modules/teams/application/dtos/register-lineup.dto.ts`:

```typescript
import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class RegisterLineupDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  playerIds: string[];
}
```

- [ ] **Step 4: Implement RegisterLineupUseCase**

Create `src/modules/teams/application/use-cases/RegisterLineupUseCase.ts`:

```typescript
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from 'src/modules/players/domain/repositories/IPlayerRepository';
import { PlayerStatus } from 'src/modules/players/domain/enums/PlayerStatus';

@Injectable()
export class RegisterLineupUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(
    teamId: string,
    playerIds: string[],
  ): Promise<{ playerIds: string[] }> {
    if (playerIds.length !== 7) {
      throw new BadRequestException('Exactly 7 players are required');
    }

    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');

    const players = await Promise.all(
      playerIds.map((id) => this.playerRepository.findById(id)),
    );

    for (const player of players) {
      if (!player) throw new NotFoundException('Player not found');
      if (player.teamId !== teamId) {
        throw new BadRequestException(
          `Player ${player.id} does not belong to this team`,
        );
      }
      if (player.status === PlayerStatus.PLAYING) {
        throw new BadRequestException(
          `Player ${player.id} is already playing`,
        );
      }
    }

    await Promise.all(
      players.map((player) => {
        player!.play();
        return this.playerRepository.save(player!);
      }),
    );

    return { playerIds };
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx jest RegisterLineupUseCase.spec.ts --no-coverage
```

Expected: PASS (7 tests)

- [ ] **Step 6: Commit**

```bash
git add src/modules/teams/application/dtos/register-lineup.dto.ts src/modules/teams/application/use-cases/RegisterLineupUseCase.ts src/modules/teams/application/use-cases/RegisterLineupUseCase.spec.ts
git commit -m "feat: add RegisterLineupUseCase"
```

---

## Task 4: Wire use cases into TeamsController and TeamsModule

**Files:**
- Modify: `src/modules/teams/presentation/teams.controller.ts`
- Modify: `src/modules/teams/teams.module.ts`

- [ ] **Step 1: Update TeamsController**

Replace full contents of `src/modules/teams/presentation/teams.controller.ts`:

```typescript
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/modules/roles/domain/enums/Role';
import { Public } from 'src/shared/decorators/is-public.decorator';
import { CreateTeamUseCase } from '../application/use-cases/CreateTeamUseCase';
import { AddPlayerUseCase } from '../application/use-cases/AddPlayerUseCase';
import { GetTeamPlayersUseCase } from '../application/use-cases/GetTeamPlayersUseCase';
import { RegisterLineupUseCase } from '../application/use-cases/RegisterLineupUseCase';
import { CreateTeamDto } from '../application/dtos/create-team.dto';
import { AddPlayerDto } from '../application/dtos/add-player.dto';
import { RegisterLineupDto } from '../application/dtos/register-lineup.dto';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly createTeam: CreateTeamUseCase,
    private readonly addPlayerUseCase: AddPlayerUseCase,
    private readonly getTeamPlayersUseCase: GetTeamPlayersUseCase,
    private readonly registerLineupUseCase: RegisterLineupUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateTeamDto) {
    return this.createTeam.execute(dto);
  }

  @Post('addPlayer')
  @Roles(Role.ADMIN)
  async addPlayer(@Body() dto: AddPlayerDto) {
    return await this.addPlayerUseCase.execute(dto);
  }

  @Get(':id/players')
  @Public()
  async getPlayers(@Param('id') id: string) {
    return await this.getTeamPlayersUseCase.execute(id);
  }

  @Post(':id/lineup')
  @Roles(Role.ADMIN)
  async registerLineup(
    @Param('id') id: string,
    @Body() dto: RegisterLineupDto,
  ) {
    return await this.registerLineupUseCase.execute(id, dto.playerIds);
  }
}
```

- [ ] **Step 2: Update TeamsModule**

Replace full contents of `src/modules/teams/teams.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AddPlayerUseCase } from './application/use-cases/AddPlayerUseCase';
import { TEAM_REPO_TOKEN } from './domain/repository/ITeamRepository';
import { PrismaTeamRepository } from './infrastructure/repository/PrismaTeamRepository';
import { TeamsController } from './presentation/teams.controller';
import { PlayersModule } from '../players/players.module';
import { CreateTeamUseCase } from './application/use-cases/CreateTeamUseCase';
import { GetTeamPlayersUseCase } from './application/use-cases/GetTeamPlayersUseCase';
import { RegisterLineupUseCase } from './application/use-cases/RegisterLineupUseCase';

@Module({
  imports: [PlayersModule],
  controllers: [TeamsController],
  providers: [
    CreateTeamUseCase,
    AddPlayerUseCase,
    GetTeamPlayersUseCase,
    RegisterLineupUseCase,
    { provide: TEAM_REPO_TOKEN, useClass: PrismaTeamRepository },
  ],
  exports: [TEAM_REPO_TOKEN],
})
export class TeamsModule {}
```

- [ ] **Step 3: Build to verify no compilation errors**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/modules/teams/presentation/teams.controller.ts src/modules/teams/teams.module.ts
git commit -m "feat: expose GET /:id/players and POST /:id/lineup endpoints"
```

---

## Task 5: Bench players on match finish

**Files:**
- Modify: `src/modules/matches/application/use-cases/FinishMatchUseCase.ts`
- Create: `src/modules/matches/application/use-cases/FinishMatchUseCase.spec.ts`
- Modify: `src/modules/matches/matches.module.ts`

- [ ] **Step 1: Write the failing test**

Create `src/modules/matches/application/use-cases/FinishMatchUseCase.spec.ts`:

```typescript
import { FinishMatchUseCase } from './FinishMatchUseCase';
import { NotFoundException } from '@nestjs/common';
import { Match } from '../../domain/entities/Match';
import { MatchStatus } from '../../domain/enums/MatchStatus';
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
      intervals: [],
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest FinishMatchUseCase.spec.ts --no-coverage
```

Expected: FAIL — constructor argument mismatch / missing player repo

- [ ] **Step 3: Update FinishMatchUseCase**

Replace full contents of `src/modules/matches/application/use-cases/FinishMatchUseCase.ts`:

```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchMapper } from '../mappers/MatchMapper';
import { MatchResponseDto } from '../dtos/match-response.dto';
import { MatchesGateway } from '../../infrastructure/gateways/matches.gateway';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from 'src/modules/players/domain/repositories/IPlayerRepository';

@Injectable()
export class FinishMatchUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private repository: IMatchRepository,
    private gateway: MatchesGateway,
    @Inject(PLAYER_REPO_TOKEN) private playerRepository: IPlayerRepository,
  ) {}

  async execute(matchId: string): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    match.finish();
    await this.repository.save(match);

    const [homePlayers, awayPlayers] = await Promise.all([
      this.playerRepository.findByTeam(match.localTeamId),
      this.playerRepository.findByTeam(match.awayTeamId),
    ]);

    await Promise.all(
      [...homePlayers, ...awayPlayers].map((player) => {
        player.bench();
        return this.playerRepository.save(player);
      }),
    );

    const response = MatchMapper.toResponse(match);
    this.gateway.emitMatchUpdated(matchId, response);
    return response;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest FinishMatchUseCase.spec.ts --no-coverage
```

Expected: PASS (2 tests)

- [ ] **Step 5: Update MatchesModule to import PlayersModule**

Replace full contents of `src/modules/matches/matches.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MatchesController } from './presentation/matches.controller';
import { MATCH_REPO_TOKEN } from './domain/repositories/IMatchRepository';
import { PrismaMatchRepository } from './infrastructure/repositories/PrismaMatchRepository';
import { CreateMatchUseCase } from './application/use-cases/CrateMatchUseCase';
import { StartMatchUseCase } from './application/use-cases/StartMatchUseCase';
import { PauseMatchUseCase } from './application/use-cases/PauseMatchUseCase';
import { HalfTimeUseCase } from './application/use-cases/HalfTimeUseCase';
import { FinishMatchUseCase } from './application/use-cases/FinishMatchUseCase';
import { RegisterEventUseCase } from './application/use-cases/RegisterEventUseCase';
import { GetLiveMatchUseCase } from './application/use-cases/GetLiveMatchUseCase';
import { MatchesGateway } from './infrastructure/gateways/matches.gateway';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [PlayersModule],
  controllers: [MatchesController],
  providers: [
    { provide: MATCH_REPO_TOKEN, useClass: PrismaMatchRepository },
    CreateMatchUseCase,
    StartMatchUseCase,
    PauseMatchUseCase,
    HalfTimeUseCase,
    FinishMatchUseCase,
    RegisterEventUseCase,
    GetLiveMatchUseCase,
    MatchesGateway,
  ],
})
export class MatchesModule {}
```

- [ ] **Step 6: Run all tests and verify no regressions**

```bash
npx jest --no-coverage
```

Expected: all tests pass

- [ ] **Step 7: Build to verify no compilation errors**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 8: Commit**

```bash
git add src/modules/matches/application/use-cases/FinishMatchUseCase.ts src/modules/matches/application/use-cases/FinishMatchUseCase.spec.ts src/modules/matches/matches.module.ts
git commit -m "feat: bench all players of both teams when match finishes"
```
