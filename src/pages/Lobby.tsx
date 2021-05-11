import styles from 'pages/Lobby.module.scss';

import { useAppSelector } from 'app/hooks';
import { selectRoomInfo } from 'app/roomSlice';

const Lobby = () => {
  const roomInfo = useAppSelector(selectRoomInfo);

  return (
    <div id={styles.lobby}>
      <button
        id={styles.roomId}
        onClick={async () => {
          await navigator.clipboard.writeText(roomInfo.roomId);
        }}
        onMouseLeave={(e)=> {
            (e.target as HTMLButtonElement).blur();
          }
        }
      >
        <span>{roomInfo.roomName}</span>
        <span id={styles.gap}></span>
        <span>{roomInfo.roomId}</span>
      </button>
    </div>
  );
};

export default Lobby;
