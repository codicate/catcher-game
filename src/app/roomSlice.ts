import { RootState } from 'app/store';
import { createSlice, createDraftSafeSelector, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { firestore } from 'utils/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';


export enum Status { dead, alive }
export enum Characters { Holden, Phoebe, Sally, Jane, Ackley, Stradlater, Allie, DB }

export interface Player {
  playerName: string,
  status: Status,
  choice: string,
  numOfLives: number;
}

const player = {
  playerName: '',
  status: Status.alive,
  choice: '',
  numOfLives: 3
};

const initialState = {
  roomInfo: {
    roomName: '',
    roomId: '',
  },
  start: false,
  players: Object.fromEntries(
    Object.keys(Characters)
      .slice(Object.keys(Characters).length / 2)
      .map(character => [character, player])
  ),

  self: {
    playerName: '',
    creator: true,
  },
  character: '',
  reveal: false
};

export type LocalState = typeof initialState;
export type DatabaseState = Omit<typeof initialState, 'self' | 'character' | 'reveal'>;


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
        self: {
          playerName: input.playerName,
          creator: true
        }
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

      if (
        Object.values(roomData.players)
          .filter(player => player.playerName)
          .length >= 8
      )
        throw new Error('Room Full');

      return {
        ...roomData,
        self: {
          playerName: input.playerName,
          creator: false
        }
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

    try {
      const roomDoc = doc(firestore, 'rooms', state.roomInfo.roomId);
      const roomSnapshot = await getDoc(roomDoc);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data() as DatabaseState;
        roomData.players[character].playerName = state.self.playerName;
        await setDoc(roomDoc, roomData);
      }

      return character;

    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const startGame = createAsyncThunk(
  'room/startGame',
  async (_, { getState, rejectWithValue }) => {
    const state = (getState() as RootState).room;

    try {
      const roomDoc = doc(firestore, 'rooms', state.roomInfo.roomId);
      const roomSnapshot = await getDoc(roomDoc);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data() as DatabaseState;
        roomData.start = true;
        await setDoc(roomDoc, roomData);
      }

      return true;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const makeChoice = createAsyncThunk(
  'room/makeChoice',
  async (choice: string, { getState, rejectWithValue }) => {
    const state = (getState() as RootState).room;

    try {
      const roomDoc = doc(firestore, 'rooms', state.roomInfo.roomId);
      const roomSnapshot = await getDoc(roomDoc);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data() as DatabaseState;
        state.character && (roomData.players[state.character].choice = choice);
        await setDoc(roomDoc, roomData);
      }

      return choice;

    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);


export const recalculateLives = createAsyncThunk(
  'room/recalculateLives',
  async (_, { getState, rejectWithValue }) => {
    const state = (getState() as RootState).room;

    try {
      const roomDoc = doc(firestore, 'rooms', state.roomInfo.roomId);
      const roomSnapshot = await getDoc(roomDoc);
      const roomData = roomSnapshot.data() as DatabaseState;
      console.log('bru', roomData)

      const totalPlayers = Object.values(roomData.players)
        .filter((player) => player.playerName)
        .length;

      const reveal = (roomData.start) && (Object.values(roomData.players).every((player) => (!player.playerName) || (player.choice)));
      console.log('reveal inside slice', reveal)

      if (reveal) {
        const selfChoice = roomData.players[state.character].choice;

        const sameChoicePlayers = Object.values(roomData.players)
          .filter((player) => player.choice === selfChoice)
          .length;

        const majorityRate = (sameChoicePlayers / totalPlayers);

        majorityRate === 0.5
          ? roomData.players[state.character].numOfLives += 0
          : majorityRate > 0.5
            ? roomData.players[state.character].numOfLives += 1
            : roomData.players[state.character].numOfLives -= 1;

        Object.values(roomData.players).forEach((player) => player.choice = '');
        await setDoc(roomDoc, roomData);
      }

      return {
        start: roomData.start,
        players: roomData.players,
        reveal
      };

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
        state.self = action.payload.self;
      }
    ).addCase(
      joinRoom.fulfilled,
      (state, action) => {
        state.roomInfo = action.payload.roomInfo;
        state.self = action.payload.self;
      }
    ).addCase(
      startGame.fulfilled,
      (state, action) => {
        state.start = action.payload;
      }
    ).addCase(
      setCharacter.fulfilled,
      (state, action) => {
        state.character = action.payload;
      }
    ).addCase(
      recalculateLives.fulfilled,
      (state, action) => {
        state.start = action.payload.start;
        state.players = action.payload.players;
        state.reveal = action.payload.reveal;
      }
    );
  }
});

// export const {

// } = roomSlice.actions;
export default roomSlice.reducer;


const selectSelf = (state: RootState) => state.room;

export const selectRoom = createDraftSafeSelector(selectSelf, (room) => room);

export const selectNumOfPlayers = createDraftSafeSelector(selectSelf, (room) =>
  Object.values(room.players)
    .filter((player) => player.playerName)
    .length
);
