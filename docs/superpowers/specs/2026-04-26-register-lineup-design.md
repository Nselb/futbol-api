# Register Lineup Design

**Date:** 2026-04-26

## Overview

Three coordinated changes to support registering a team's starting lineup before a match, exposing team player IDs, and resetting player statuses when a match finishes.

---

## 1. Get Team Players Endpoint

**Endpoint:** `GET /teams/:id/players`

**Use case:** `GetTeamPlayersUseCase` (teams module)

**Behavior:**
- Loads the team by ID; throws `NotFoundException` if not found.
- Uses the existing `IPlayerRepository.findByTeam(teamId)` to fetch all players on the team.
- Returns `{ playerIds: string[] }`.

**Auth:** Public (consistent with existing `GET /players/byId/:id`).

---

## 2. Register Lineup Endpoint

**Endpoint:** `POST /teams/:id/lineup`

**Body:** `{ playerIds: string[] }` (exactly 7 IDs)

**Use case:** `RegisterLineupUseCase` (teams module)

**Behavior:**
1. Validates `playerIds.length === 7`; throws `BadRequestException` if not.
2. Loads the team; throws `NotFoundException` if not found.
3. Loads each player; throws `NotFoundException` if any is missing.
4. Validates each player belongs to the team; throws `BadRequestException` if not.
5. Validates each player is `BENCHED`; throws `BadRequestException` if any is already `PLAYING`.
6. Calls `player.play()` on each and saves them via `IPlayerRepository`.
7. Returns `{ playerIds: string[] }` of the registered players.

**Auth:** `ADMIN` role required.

---

## 3. Player Domain Methods

Two new methods added to the `Player` entity to encapsulate status transitions:

- `play()` — sets `status` to `PlayerStatus.PLAYING`.
- `bench()` — sets `status` to `PlayerStatus.BENCHED`.

---

## 4. Reset Players on Match Finish

**Modified use case:** `FinishMatchUseCase` (matches module)

**Behavior:**
- After `match.finish()`, fetches all players for both `localTeamId` and `awayTeamId` using `IPlayerRepository.findByTeam()`.
- Calls `player.bench()` on each and saves them.

**Dependency:** `IPlayerRepository` injected into `FinishMatchUseCase`.

---

## Data Flow

```
POST /teams/:id/lineup
  → RegisterLineupUseCase
    → validate 7 playerIds
    → ITeamRepository.findById()       (verify team exists)
    → IPlayerRepository.findById() x7  (verify players exist + belong to team + are BENCHED)
    → player.play() x7
    → IPlayerRepository.save() x7
    → return { playerIds }

GET /teams/:id/players
  → GetTeamPlayersUseCase
    → ITeamRepository.findById()       (verify team exists)
    → IPlayerRepository.findByTeam()
    → return { playerIds }

PATCH /matches/:id/finish
  → FinishMatchUseCase
    → IMatchRepository.findById()
    → match.finish()
    → IMatchRepository.save()
    → IPlayerRepository.findByTeam(localTeamId) + findByTeam(awayTeamId)
    → player.bench() x N
    → IPlayerRepository.save() x N
```

---

## Error Cases

| Condition | Error |
|-----------|-------|
| `playerIds.length !== 7` | `400 Bad Request` |
| Team not found | `404 Not Found` |
| Any player not found | `404 Not Found` |
| Any player not on this team | `400 Bad Request` |
| Any player already `PLAYING` | `400 Bad Request` |

---

## Files Changed

- `src/modules/players/domain/entities/Player.ts` — add `play()` and `bench()`
- `src/modules/teams/application/use-cases/GetTeamPlayersUseCase.ts` — new
- `src/modules/teams/application/use-cases/RegisterLineupUseCase.ts` — new
- `src/modules/teams/application/dtos/register-lineup.dto.ts` — new
- `src/modules/teams/presentation/teams.controller.ts` — add two new routes
- `src/modules/teams/teams.module.ts` — register new use cases
- `src/modules/matches/application/use-cases/FinishMatchUseCase.ts` — inject player repo + bench players
- `src/modules/matches/matches.module.ts` — add player repo to FinishMatchUseCase providers
