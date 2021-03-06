
import 'App.scss';
import { Switch, Route } from "react-router-dom";

import Homepage from 'pages/Homepage/Homepage';
import JoinRoom from 'pages/JoinRoom/JoinRoom';
import CreateRoom from 'pages/CreateRoom/CreateRoom';
import Lobby from 'pages/Lobby/Lobby';
import Game from 'pages/Game/Game';


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
        <Route exact path='/game'>
          <Game />
        </Route>
      </Switch>
      <div className='gameInfo'>About the Game</div>
    </>
  );
}

export default App;
