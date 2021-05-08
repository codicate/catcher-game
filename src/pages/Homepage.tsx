import { firestore } from 'utils/firebase';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

import Form from 'components/Form/Form';
import { useState, useRef } from 'react';

const getCodeFromDate = (numOfDigit: number) => {
  return new Date().getTime().toString().slice(-numOfDigit);
};

const Header = () => {
  const roomId = useRef(getCodeFromDate(6));
  const [createdRoom, setCreatedRoom] = useState(false);
  return (
    <div>
      {(
        createdRoom
      ) ? (
        <p>{roomId.current}</p>
      ) : (
        <button
          onClick={async () => {
            setCreatedRoom(true);
            await setDoc(doc(firestore, 'rooms', roomId.current), {
              roomId: roomId.current,
              owner: 'Henry'
            });
          }}
        >
          Create Room
        </button>
      )}

      <Form
        submitFn={async (input) => {
          const roomSnapshot = await getDoc(doc(firestore, 'rooms', input.join));

          if (roomSnapshot.exists()) {
            console.log("Document data:", roomSnapshot.data());
          } else {
            alert('Room not Found');
          }

          return true;
        }}
        inputItems={[
          ['join', 'Join Room', {
            inputMode: 'numeric',
            pattern: '\\d{6}',
            title: '6 numeric digits'
          }]
        ]}
      >
        <button type='submit'>
          Submit
        </button>
      </Form>
    </div >
  );
};

export default Header;
