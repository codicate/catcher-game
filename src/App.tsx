import 'App.css';
import { Switch, Route } from "react-router-dom";

import Header from 'pages/Header';
import Homepage from 'pages/Homepage';

function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path='/'>
          <Homepage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
