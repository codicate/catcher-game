
import 'App.scss';
import { createContext, useRef } from 'react';
import { Switch, Route } from "react-router-dom";

import Header from 'pages/Header';
import Homepage from 'pages/Homepage';
import JoinRoom from 'pages/JoinRoom';
import CreateRoom from 'pages/CreateRoom';
import Lobby from 'pages/Lobby';


export enum Status { dead, alive }

export const Context = createContext({
  roomId: ''
});

const getCodeFromDate = (numOfDigit: number) => {
  return new Date().getTime().toString().slice(-numOfDigit);
};

function App() {
  const roomId = useRef(getCodeFromDate(6));

  return (
    <>
      <Context.Provider value={{ roomId: roomId.current }}>
        <Switch>
          <Route exact path='/'>
            <Homepage />
          </Route>
          <Route exact path='/join'>
            <JoinRoom />
          </Route>
          <Route exact path='/create'>
            <CreateRoom />
          </Route>
          <Route exact path='/lobby'>
            <Lobby />
          </Route>
        </Switch>
      </Context.Provider>
    </>
  );
}

export default App;
