import styles from 'pages/JoinRoom.module.scss';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { firestore } from 'utils/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

import { Context, Status } from 'App';
import Form from 'components/Form/Form';
import Button from 'components/Button';


const JoinRoom = () => {
  const history = useHistory();
  const context = useContext(Context);

  return (
    <div id={styles.join}>
      <Form
        id={styles.form}
        submitFn={async (input) => {
          const roomDoc = doc(firestore, 'rooms', input.join);
          const unsubFromSnapshot = onSnapshot((roomDoc), async (doc) => {
            if (doc.exists()) {
              console.log("Document data:", doc.data());
              context = doc.data();

              await setDoc(roomDoc, {
                ...doc.data(),
                players: doc.data().players.concat({
                  name: input.name,
                  status: Status.alive,
                })
              });
            } else {
              alert('Room not Found');
            }
          });

          history.push('/lobby');
          return true;
        }}
        inputItems={[[
          'join', '',
          {
            inputMode: 'numeric',
            pattern: '\\d{6}',
            title: '6 numeric digits',

            selectAllOnFocus: true,
            placeholder: 'Room ID',
            required: true,
          }
        ], [
          'name', '',
          {
            selectAllOnFocus: true,
            placeholder: 'Your Name',
            required: true,
          }
        ]]}
      >
        <Button type='submit'>
          Join Room
        </Button>
      </Form>
    </div>
  );
};

export default JoinRoom;
