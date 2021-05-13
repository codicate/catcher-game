import styles from 'pages/Lobby/Player.module.scss';
import { selectCharacter } from 'app/roomSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Characters, Player } from 'app/roomSlice';

import characterImgs from 'assets/characterImgs';

function PlayerDiv({
  idx,
  character,
  player,
}: {
  idx: number;
  character: string;
  player: Player;
}) {
  const dispatch = useAppDispatch();

  return (
    <div
      className={`
      ${styles.player}
      ${!player ? styles.movingStripe : ''}
    `}
      onClick={() => {
        dispatch(selectCharacter(character))
      }}
    >
      {(() => {
        const test = character as keyof typeof characterImgs;
        console.log('character:', characterImgs[test]);
      })()}
      <img src={characterImgs.Ackley} alt="" />
      <div>
        {player?.playerName || 'Choose me'}
      </div>
    </div>
  );
}

export default PlayerDiv;
