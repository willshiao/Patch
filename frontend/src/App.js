import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './components/Home/Home';
import Upload from './components/Upload/Upload';
import Result from './components/Result/Result';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/upload" component={Upload} />
          <Route exact path="/result" component={Result} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
