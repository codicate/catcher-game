import styles from 'pages/CreateRoom.module.scss';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Context } from 'App';
import { firestore } from 'utils/firebase';
import { doc, setDoc } from 'firebase/firestore';

import { Status } from 'App';
import Form from 'components/Form/Form';
import Button from 'components/Button';


const CreateRoom = () => {
  const history = useHistory();
  const { roomId } = useContext(Context);

  return (
    <div id={styles.create}>
      <Form
        submitFn={async (input) => {
          await setDoc(doc(firestore, 'rooms', roomId), {
            roomId: roomId,
            roomName: input.roomName || `Room ${roomId}`,
            players: [{
              name: input.name,
              status: Status.alive,
            }]
          });

          history.push('/lobby');
          return true;
        }}
        inputItems={[[
          'roomName', '',
          {
            defaultValue: `Room ${roomId}`,
            selectAllOnFocus: true,
            placeholder: 'Room Name',
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
          Create Room
          </Button>
      </Form>
    </div >
  );
};

export default CreateRoom;
