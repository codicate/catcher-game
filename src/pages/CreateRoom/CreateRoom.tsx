import styles from 'pages/CreateRoom/CreateRoom.module.scss';
import { useHistory } from 'react-router-dom';

import { useAppDispatch } from 'app/hooks';
import { createRoom } from 'app/roomSlice';

import Form from 'components/Form/Form';
import Button from 'components/Button';


const CreateRoom = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  return (
    <div id={styles.create}>
      <Form
        submitFn={async (input) => {
          dispatch(createRoom(input));
          history.push('/lobby');
          return true;
        }}

        inputItems={{
          roomName: {
            selectAllOnFocus: true,
            placeholder: 'Room Name',
            required: true,
          },
          name: {
            selectAllOnFocus: true,
            placeholder: 'Your Name',
            required: true,
          }
        }}>
        <Button type='submit'>
          Create Room
        </Button>
      </Form>
    </div >
  );
};

export default CreateRoom;
