import { RootState } from 'app/store';
import { createSlice, createDraftSafeSelector, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { firestore } from 'utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';


enum Status { dead, alive }

interface Player {
  name: string,
  status: Status,
}

interface Room {
  roomInfo: {
    roomName: string;
    roomId: string;
  },
  players: Player[];
}

const initialState: Room = {
  roomInfo: {
    roomName: '',
    roomId: '',
  },
  players: []
};


const getCodeFromDate = (numOfDigit: number) => {
  return new Date().getTime().toString().slice(-numOfDigit);
};

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (input: {
    roomName: string;
    name: string;
  }, { rejectWithValue }) => {
    const roomId = getCodeFromDate(6);

    const roomData = {
      roomInfo: {
        roomId,
        roomName: input.roomName || `Room ${roomId}`,
      },
      players: [{
        name: input.name,
        status: Status.alive,
      }]
    };

    try {
      const roomDoc = doc(firestore, 'rooms', roomId);
      await setDoc(roomDoc, roomData);
      return roomData;

    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const joinRoom = createAsyncThunk(
  'room/joinRoom',
  async (input: {
    roomId: string;
    playerName: string;
  }, { rejectWithValue }) => {
    try {
      const roomDoc = doc(firestore, 'rooms', input.roomId);
      const roomSnapshot = await getDoc(roomDoc);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data() as Room;
        console.log("Room data:", roomData);

        await setDoc(roomDoc, {
          ...roomData,
          players: roomData.players.concat({
            name: input.playerName,
            status: Status.alive,
          })
        });

        return roomData;
      } else {
        alert('Room not Found');
        return initialState;
      }
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);


const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      createRoom.fulfilled,
      (state, action) => {
        state.roomInfo = action.payload.roomInfo;
      }
    ).addCase(
      joinRoom.fulfilled,
      (state, action) => {
        state.roomInfo = action.payload.roomInfo;
      }
    );
  }
});

// export const {

// } = roomSplice.actions;
export default roomSlice.reducer;


const selectSelf = (state: RootState) => state.room;

export const selectRoomInfo = createDraftSafeSelector(selectSelf, (room) =>
  room.roomInfo
);

export const selectPlayers = createDraftSafeSelector(selectSelf, (room) =>
  room.players
);
