import styles from 'pages/Lobby/Lobby.module.scss';
import { useEffect, useState } from 'react';

import { firestore } from 'utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  updateLocalState, DatabaseState, setCharacter, Player,
  selectRoomInfo, selectPlayers,

} from 'app/roomSlice';

import PlayerDiv from 'pages/Lobby/PlayerDiv';


const Lobby = () => {
  const dispatch = useAppDispatch();

  const roomInfo = useAppSelector(selectRoomInfo);
  const players = useAppSelector(selectPlayers);

  useEffect(() => {
    const roomDoc = doc(firestore, 'rooms', roomInfo.roomId);

    const unsubSnapshot = onSnapshot(roomDoc, (doc) => {
      dispatch(updateLocalState(doc.data() as DatabaseState));
    });

    return () => unsubSnapshot();
  }, [dispatch, roomInfo]);

  const [chosenCharacter, setChosenCharacter] = useState(false);

  const chooseCharacter = (character: string, player: Player) => {
    if (!chosenCharacter && !player?.playerName) {
      dispatch(setCharacter(character));
      setChosenCharacter(true);
    }
  };

  return (
    <div className={styles.lobby}>
      <button
        className={styles.roomId}
        onClick={async () => {
          await navigator.clipboard.writeText(roomInfo.roomId);
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).blur();
        }}
      >
        <span>{roomInfo.roomName}</span>
        <span className={styles.gap}></span>
        <span>{roomInfo.roomId}</span>
      </button>
      <div className={styles.board}>
        {
          Object.entries(players).sort().map(([character, player], idx) =>
            <PlayerDiv
              key={idx}
              idx={idx}
              chooseCharacter={chooseCharacter}
              character={character}
              player={player}
            />
          )
        }
      </div>
    </div>
  );
};

export default Lobby;
