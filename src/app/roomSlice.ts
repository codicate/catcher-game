import { RootState } from 'app/store';
import { createSlice, createDraftSafeSelector, createAsyncThunk } from '@reduxjs/toolkit';

import { firestore } from 'utils/firebase';
import { collectionGroup, doc, getDoc, setDoc } from 'firebase/firestore';


export enum Status { dead, alive }
export enum Characters { Holden, Phoebe, Sally, Jane, Ackley, Stradlater, Allie, DB }

export interface Player {
  playerName: string,
  status: Status,
}

const player = {
  playerName: '',
  status: Status.alive,
};

const initialState = {
  roomInfo: {
    roomName: '',
    roomId: '',
  },
  self: {
    playerName: ''
  },
  players: Object.fromEntries(
    Object.keys(Characters)
      .slice(Object.keys(Characters).length / 2)
      .map(character => [character, player])
  )
};


const getCodeFromDate = (numOfDigit: number) => {
  return new Date().getTime().toString().slice(-numOfDigit);
};

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (input: {
    playerName: string;
    roomName: string;
  }, {
    rejectWithValue
  }) => {
    const roomId = getCodeFromDate(6);

    const roomData = {
      roomInfo: {
        roomId,
        roomName: input.roomName || `Room ${roomId}`,
      },
      players: initialState.players
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

      const roomData = roomSnapshot.data() as typeof initialState;
      console.log("Room data:", roomData);

      // NEED FIX
      if (Object.values(roomData.players).filter(player => player).length >= 1000)
        throw new Error('Room Full');

      await setDoc(roomDoc, roomData);
      return roomData;

    } catch (err) {
      console.error(err);
      alert(err);
      return rejectWithValue(err.response.data);
    }
  }
);


export const selectCharacter = createAsyncThunk(
  'room/selectCharacter',
  async (character: string, { rejectWithValue }) => {
    try {
      const roomDoc = doc(firestore, 'rooms', initialState.roomInfo.roomId);
      const roomSnapshot = await getDoc(roomDoc);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data() as typeof initialState;

        // roomData.players[character] = {
        //   name: '',
        //   status: Status.alive,
        // };
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
        state.players = action.payload.players;
      }
    ).addCase(
      joinRoom.fulfilled,
      (state, action) => {
        state.roomInfo = action.payload.roomInfo;
        state.players = action.payload.players;
      }
    );/*.addCase(
      selectCharacter.fulfilled,
      (state, action) => {

      }
    );*/
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
