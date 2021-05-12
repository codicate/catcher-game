import styles from 'pages/Lobby/Lobby.module.scss';

import { useAppSelector } from 'app/hooks';
import { selectRoomInfo, selectPlayers } from 'app/roomSlice';

import characterImgs from 'assets/characterImgs';
import Player from 'pages/Lobby/Player';

const Lobby = () => {
  const roomInfo = useAppSelector(selectRoomInfo);
  const players = useAppSelector(selectPlayers);

  return (
    <div className={styles.lobby}>
      <button
        className={styles.roomId}
        onClick={async () => {
          await navigator.clipboard.writeText(roomInfo.roomId);
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).blur();
        }
        }
      >
        <span>{roomInfo.roomName}</span>
        <span className={styles.gap}></span>
        <span>{roomInfo.roomId}</span>
      </button>
      <div className={styles.board}>
        {
          characterImgs.map((img, idx) =>
            <Player
              key={idx}
              idx={idx}
              img={img}
              player={players[idx]}
            />
          )
        }
      </div>
    </div>
  );
};

export default Lobby;
