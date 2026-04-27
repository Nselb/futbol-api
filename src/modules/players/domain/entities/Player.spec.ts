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
