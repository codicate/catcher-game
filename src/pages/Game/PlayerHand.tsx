import styles from 'pages/Game/PlayerHand.module.scss';

import { Player } from 'app/roomSlice';
import characterImgs from 'assets/characterImgs';
import Card from 'pages/Game/Card';

const PlayerHand = ({
  character,
  player,
  choice,
  hide
}: {
  character: string;
  player: Player;
  choice?: { letter: string, text: string; };
  hide: boolean;
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
            [...Array(player.numOfLives)].map((_, idx) => (
              <div key={idx} />
            ))
          }
        </div>
      </div>
      {choice?.text && (
        hide ? (
          <div className={styles.backOfCard} />
        ) : (
          <Card
            type={`choice${choice.letter.toUpperCase()} small`}
            text={choice.text}
          />
        )
      )}
    </div>
  );
};

export default PlayerHand;
