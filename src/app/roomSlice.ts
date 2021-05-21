import { RootState } from 'app/store';
import { createSlice, createDraftSafeSelector, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { firestore } from 'utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import cards from 'assets/cards';

export enum Status { dead, alive }
export enum Characters { Holden, Phoebe, Sally, Jane, Ackley, Stradlater, Allie, DB }


const player = {
  playerName: '',
  status: Status.alive,
  choice: { letter: '', text: '' },
  numOfLives: 3
};

export type Player = typeof player;

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
  hide: true,
  reveal: false,
  questionIdx: 0
};

export type LocalState = typeof initialState;
export type DatabaseState = Omit<typeof initialState, 'self' | 'character'>;


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
        roomName: input.roomName || `Room ${roomId}`
      },
      players: initialState.players,
      start: false,
      hide: true,
      reveal: false,
      questionIdx: 0
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


const nextRound = createAsyncThunk(
  'room/nextRound',
  async (_, { getState }) => {
    const state = (getState() as RootState).room;
    const roomDoc = doc(firestore, 'rooms', state.roomInfo.roomId);
    const roomSnapshot = await getDoc(roomDoc);
    const roomData = roomSnapshot.data() as DatabaseState;

    roomData.players = Object.fromEntries(Object.entries(roomData.players).map(([character, player]) => {
      player.choice = { letter: '', text: '' };
      return [character, player];
    }));

    roomData.questionIdx = (() => {
      while (true) {
        const questionIdx = Math.floor(Math.random() * cards.length);
        if (questionIdx !== roomData.questionIdx) return questionIdx;
      }
    })();

    console.log('questionIdx in Slice', roomData.questionIdx);
    roomData.reveal = false;
    roomData.hide = true;

    await setDoc(roomDoc, roomData);
    return roomData;
  }
);

export const makeChoice = createAsyncThunk(
  'room/makeChoice',
  async (choice: { letter: string, text: string; }, { getState, dispatch, rejectWithValue }) => {
    const state = (getState() as RootState).room;

    try {
      const roomDoc = doc(firestore, 'rooms', state.roomInfo.roomId);
      const roomSnapshot = await getDoc(roomDoc);
      const roomData = roomSnapshot.data() as DatabaseState;

      state.character && (roomData.players[state.character].choice = choice);

      const reveal = Object.values(roomData.players).every((player) => (!player.playerName) || (player.choice.text));
      console.log('reveal inside slice', reveal);

      if (reveal) {
        roomData.hide = false;
        roomData.reveal = true;
        console.log('bru', roomData.players[state.character].playerName, roomData.players[state.character].numOfLives);

        const totalPlayers = Object.values(roomData.players)
          .filter((player) => player.playerName)
          .length;

        roomData.players = Object.fromEntries(
          Object.entries(roomData.players).map(([character, player]) => {
            const sameChoicePlayers = Object.values(roomData.players)
              .filter((otherPlayer) => otherPlayer.choice.text === player.choice.text)
              .length;
            const majorityRate = (sameChoicePlayers / totalPlayers);

            (majorityRate === 0.5) || (player.numOfLives === 0)
              ? player.numOfLives += 0
              : (majorityRate > 0.5)
                ? player.numOfLives += 1
                : player.numOfLives -= 1;

            return [character, player];
          })
        );

        setTimeout(() => {
          dispatch(nextRound());
        }, 5000);
      }

      await setDoc(roomDoc, roomData);
      return roomData;

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
      state.start = action.payload.start;
      state.reveal = action.payload.reveal;
      state.hide = action.payload.hide;
      state.questionIdx = action.payload.questionIdx;
    }
  },
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
    )
  }
});

export const {
  updateLocalState
} = roomSlice.actions;
export default roomSlice.reducer;


const selectSelf = (state: RootState) => state.room;

export const selectRoom = createDraftSafeSelector(selectSelf, (room) => room);

export const selectNumOfPlayers = createDraftSafeSelector(selectSelf, (room) =>
  Object.values(room.players)
    .filter((player) => player.playerName)
    .length
);
