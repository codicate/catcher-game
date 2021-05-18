import styles from 'pages/Game/Game.module.scss';
import { useState } from 'react';

import { useFirebaseSyncState } from 'utils/hooks';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  setCharacter, Player,
  selectRoom, selectNumOfPlayers
} from 'app/roomSlice';

import RoomInfo from 'components/RoomInfo';
import PlayerDiv from 'pages/Lobby/PlayerDiv';


const Game = () => {
  const dispatch = useAppDispatch();

  const { roomInfo, players, self } = useAppSelector(selectRoom);
  const numOfPlayers = useAppSelector(selectNumOfPlayers);

  useFirebaseSyncState();

  return (
    <div className={styles.game}>
      <RoomInfo
        theme={styles.roomInfo}
        {...roomInfo}
      />

      <div className={styles.board}>
      </div>
    </div>
  );
};

export default Game;
