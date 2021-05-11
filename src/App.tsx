
import 'App.scss';
import { Switch, Route } from "react-router-dom";

import Header from 'pages/Header';
import Homepage from 'pages/Homepage';
import JoinRoom from 'pages/JoinRoom';
import CreateRoom from 'pages/CreateRoom';
import Lobby from 'pages/Lobby';


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
