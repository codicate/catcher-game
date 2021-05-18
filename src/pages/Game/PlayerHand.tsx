import styles from 'pages/Game/PlayerHand.module.scss';

import { Player } from 'app/roomSlice';
import characterImgs from 'assets/characterImgs';
import Card from 'pages/Game/Card';

const PlayerHand = ({
  idx,
  character,
  player,
  choice
}: {
  idx: number;
  character: string;
  player: Player;
  choice?: string;
}) => {
  return (
    <div className={styles.playerHand}>
      <div className={styles.avatar}>
        <img
          src={characterImgs[character as keyof typeof characterImgs]}
          alt=""
        />
        <div>
          {player?.playerName || 'Choose me'}
        </div>
      </div>
      {choice && (
        <Card
          type='choiceA small'
          text={choice}
        />
      )}
    </div>
  );
};

export default PlayerHand;
