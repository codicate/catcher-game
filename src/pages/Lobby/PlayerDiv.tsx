import styles from 'pages/Lobby/PlayerDiv.module.scss';

import { Player } from 'app/roomSlice';
import characterImgs from 'assets/characterImgs';

function PlayerDiv({
  idx,
  character,
  player,
  chooseCharacter,
}: {
  idx: number;
  character: string;
  player: Player;
  chooseCharacter: (character: string, player: Player) => void;
}) {
  return (
    <div
      className={`
      ${styles.player}
      ${!player.playerName ? styles.movingStripe : ''}
    `}
      onClick={() => chooseCharacter(character, player)}
    >
      <img
        src={characterImgs[character as keyof typeof characterImgs]}
        alt=""
      />
      <div>
        {player?.playerName || 'Choose me'}
      </div>
    </div>
  );
}

export default PlayerDiv;
