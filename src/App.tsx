
import 'App.scss';
import { Switch, Route } from "react-router-dom";

import Header from 'pages/Header/Header';
import Homepage from 'pages/Homepage/Homepage';
import JoinRoom from 'pages/JoinRoom/JoinRoom';
import CreateRoom from 'pages/CreateRoom/CreateRoom';
import Lobby from 'pages/Lobby/Lobby';


function App() {

  return (
    <>
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
    </>
  );
}

export default App;
