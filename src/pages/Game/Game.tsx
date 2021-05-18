import styles from 'pages/Game/Game.module.scss';
import { useState } from 'react';

import { useFirebaseSyncState } from 'utils/hooks';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  setCharacter, Player,
  selectRoom, selectNumOfPlayers
} from 'app/roomSlice';

import cards from 'assets/cards';
import RoomInfo from 'components/RoomInfo';
import Card from 'pages/Game/Card';
import PlayerHand from 'pages/Game/PlayerHand';


const Game = () => {
  const dispatch = useAppDispatch();

  const { roomInfo, players, self } = useAppSelector(selectRoom);
  const numOfPlayers = useAppSelector(selectNumOfPlayers);

  useFirebaseSyncState();

  return (
    <div className={styles.game}>
      <div className={styles.players}>
        {
          Object.entries(players).sort()
            .filter(([_, player]) =>
              player.playerName
            ).map(([character, player], idx) =>
              <PlayerHand
                key={idx}
                idx={idx}
                character={character}
                player={player}
                lives={3}
                choice={cards[0].choices.a}
                reveal={false}
              />
            )
        }
      </div>

      <div className={styles.panel}>
        <RoomInfo
          theme={styles.roomInfo}
          {...roomInfo}
        />

        <Card
          type='question'
          text={cards[0].question}
          onClick={() => {

          }}
        />

        <div className={styles.choices}>
          <Card
            type='choiceA'
            text={cards[0].choices.a}
            onClick={() => {

            }}
          />
          <Card
            type='choiceB'
            text={cards[0].choices.b}
            onClick={() => {

            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
