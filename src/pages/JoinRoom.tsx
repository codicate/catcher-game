import styles from 'pages/JoinRoom.module.scss';
import { useHistory } from 'react-router-dom';

import { useAppDispatch } from 'app/hooks';
import { joinRoom } from 'app/roomSlice';

import Form from 'components/Form/Form';
import Button from 'components/Button';


const JoinRoom = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  return (
    <div id={styles.join}>
      <Form
        id={styles.form}
        submitFn={async (input) => {
          dispatch(joinRoom(input));
          history.push('/lobby');
        }}
        inputItems={{
          roomId: {
            inputMode: 'numeric',
            pattern: '\\d{6}',
            title: '6 numeric digits',
            selectAllOnFocus: true,
            placeholder: 'Room ID',
            required: true,
          },
          playerName: {
            selectAllOnFocus: true,
            placeholder: 'Your Name',
            required: true,
          }
        }}
      >
        <Button type='submit'>
          Join Room
        </Button>
      </Form>
    </div>
  );
};

export default JoinRoom;
