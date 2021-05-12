import styles from 'pages/Lobby/Player.module.scss';
import { Player } from 'app/roomSlice';

function PlayerDiv({
  idx,
  img,
  player,
}: {
  idx: number;
  img: string;
  player: Player;
}) {
  return (
    <div id={styles.player}>
      <img src={img} alt="" />
      <div>
        {player.name}
      </div>
    </div>
  );
}

export default PlayerDiv;
