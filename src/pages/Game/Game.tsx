import styles from 'pages/Game/Game.module.scss';
import { useState } from 'react';

import { useFirebaseSyncState } from 'utils/hooks';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  setCharacter, Player,
  selectRoom, selectNumOfPlayers

} from 'app/roomSlice';

import PlayerDiv from 'pages/Lobby/PlayerDiv';


const Game = () => {
  const dispatch = useAppDispatch();

  const { roomInfo, players, self } = useAppSelector(selectRoom);
  const numOfPlayers = useAppSelector(selectNumOfPlayers);

  useFirebaseSyncState();

  return (
    <div className={styles.game}>

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
      </div>
    </div>
  );
};

export default Game;
