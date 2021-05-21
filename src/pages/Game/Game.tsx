import styles from 'pages/Game/Game.module.scss';

import { useFirebaseSyncState } from 'utils/hooks';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { makeChoice, selectRoom } from 'app/roomSlice';

import cards from 'assets/cards';
import RoomInfo from 'components/RoomInfo';
import Card from 'pages/Game/Card';
import PlayerHand from 'pages/Game/PlayerHand';


const Game = () => {
  const dispatch = useAppDispatch();
  const { roomInfo, players, reveal, hide, questionIdx } = useAppSelector(selectRoom);
  console.log('questionIdx', questionIdx);
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
                character={character}
                player={player}
                choice={player.choice}
                hide={hide}
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
          text={cards[questionIdx].question}
          onClick={() => {

          }}
        />

        <div className={styles.choices}>
          <Card
            type='choiceA'
            text={cards[questionIdx].choices.a}
            onClick={() => {
              !reveal && dispatch(makeChoice({ letter: 'a', text: cards[0].choices.a }));
            }}
          />
          <Card
            type='choiceB'
            text={cards[questionIdx].choices.b}
            onClick={() => {
              !reveal && dispatch(makeChoice({ letter: 'b', text: cards[0].choices.b }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
