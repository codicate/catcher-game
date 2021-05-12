import { RootState } from 'app/store';
import { createSlice, createDraftSafeSelector, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { firestore } from 'utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';


export enum Status { dead, alive }

export interface Player {
  name: string,
  status: Status,
}

export interface Room {
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

      if (!roomSnapshot.exists())
        throw new Error('Room not Found');

      const roomData = roomSnapshot.data() as Room;
      console.log("Room data:", roomData);

      if (roomData.players.length >= 1000)
        throw new Error('Room Full');

      await setDoc(roomDoc, {
        ...roomData,
        players: roomData.players.concat({
          name: input.playerName,
          status: Status.alive,
        })
      });

      return roomData;

    } catch (err) {
      console.error(err);
      alert(err);
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
        state.players = action.payload.players;
      }
    ).addCase(
      joinRoom.fulfilled,
      (state, action) => {
        state.roomInfo = action.payload.roomInfo;
        state.players = action.payload.players;
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
