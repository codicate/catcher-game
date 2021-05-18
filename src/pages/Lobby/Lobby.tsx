import styles from 'pages/Lobby/Lobby.module.scss';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useFirebaseSyncState } from 'utils/hooks';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  setCharacter, Player,
  selectRoom, selectNumOfPlayers

} from 'app/roomSlice';

import RoomInfo from 'components/RoomInfo';
import PlayerDiv from 'pages/Lobby/PlayerDiv';


const Lobby = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [chosenCharacter, setChosenCharacter] = useState(false);
  const { roomInfo, players, self } = useAppSelector(selectRoom);
  const numOfPlayers = useAppSelector(selectNumOfPlayers);

  useFirebaseSyncState();

  const chooseCharacter = (character: string, player: Player) => {
    if (!chosenCharacter && !player?.playerName) {
      dispatch(setCharacter(character));
      setChosenCharacter(true);
    }
  };

  return (
    <div className={styles.lobby}>

      <RoomInfo {...roomInfo} />

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

      {
        self.creator && (
          <button
            className={styles.start}
            onClick={() => {
              if (numOfPlayers < 3)
                return alert('Not Enought Players');

              history.push('/game');
            }}
          >
            Start Game
          </button>
        )
      }
    </div>
  );
};

export default Lobby;
