import { RootState } from 'app/store';
import { createSlice, createDraftSafeSelector, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { firestore } from 'utils/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';


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

export type LocalState = typeof initialState;
export type DatabaseState = Omit<typeof initialState, 'self'>;


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
      return {
        ...roomData,
        playerName: input.playerName
      };

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

      const roomData = roomSnapshot.data() as DatabaseState;
      console.log("Room data:", roomData);

      // NEED FIX player filter by comparing player name
      if (Object.values(roomData.players).filter(player => player).length >= 1000)
        throw new Error('Room Full');

      await setDoc(roomDoc, roomData);
      return {
        ...roomData,
        playerName: input.playerName
      };

    } catch (err) {
      console.error(err);
      alert(err);
      return rejectWithValue(err.response.data);
    }
  }
);


export const setCharacter = createAsyncThunk(
  'room/selectCharacter',
  async (character: string, { getState, rejectWithValue }) => {
    const state = (getState() as RootState).room;

    console.log('name', state.self.playerName);

    try {
      const roomDoc = doc(firestore, 'rooms', state.roomInfo.roomId);
      const roomSnapshot = await getDoc(roomDoc);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data() as DatabaseState;

        roomData.players[character] = {
          playerName: state.self.playerName,
          status: Status.alive,
        };

        await setDoc(roomDoc, roomData);
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
  reducers: {
    updateLocalState: (state, action: PayloadAction<DatabaseState>) => {
      state.players = action.payload.players;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      createRoom.fulfilled,
      (state, action) => {
        state.roomInfo = action.payload.roomInfo;
        state.players = action.payload.players;
        state.self.playerName = action.payload.playerName;
      }
    ).addCase(
      joinRoom.fulfilled,
      (state, action) => {
        state.roomInfo = action.payload.roomInfo;
        state.players = action.payload.players;
        state.self.playerName = action.payload.playerName;
      }
    );/*.addCase(
      selectCharacter.fulfilled,
      (state, action) => {

      }
    );*/
  }
});

export const {
  updateLocalState
} = roomSlice.actions;
export default roomSlice.reducer;


const selectSelf = (state: RootState) => state.room;

export const selectRoomInfo = createDraftSafeSelector(selectSelf, (room) =>
  room.roomInfo
);

export const selectPlayers = createDraftSafeSelector(selectSelf, (room) =>
  room.players
);
