import styles from 'pages/Game/PlayerHand.module.scss';

import { Player } from 'app/roomSlice';
import characterImgs from 'assets/characterImgs';
import Card from 'pages/Game/Card';

const PlayerHand = ({
  idx,
  character,
  player,
  lives,
  choice,
  reveal
}: {
  idx: number;
  character: string;
  player: Player;
  lives: number;
  choice?: string;
  reveal: boolean;
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
        <div className={styles.lives}>
          {
            [...Array(lives)].map(() => (
              <div />
            ))
          }
        </div>
      </div>
      {choice && (
        reveal ? (
          <Card
            type='choiceA small'
            text={choice}
          />
        ) : (
          <div className={styles.backOfCard} />
        )
      )}
    </div>
  );
};

export default PlayerHand;
