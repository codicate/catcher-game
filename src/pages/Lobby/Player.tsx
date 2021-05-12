import styles from 'pages/Lobby/Player.module.scss';
import { Player } from 'app/roomSlice';

function PlayerDiv({
  img,
  player,
}: {
  idx: number;
  img: string;
  player: Player;
}) {
  return (
    <div
      className={`
      ${styles.player}
      ${!player ? styles.movingStripe : ''}
    `}
      onClick={() => {
        
      }}
    >
      <img src={img} alt="" />
      <div>
        {player?.name || 'Choose me'}
      </div>
    </div>
  );
}

export default PlayerDiv;
