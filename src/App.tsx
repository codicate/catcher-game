
import { Switch, Route } from "react-router-dom";

import { addCollection } from 'utils/firebase';

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
