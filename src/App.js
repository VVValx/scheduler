import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Scheduler from './pages/scheduler/Scheduler';
import './App.css';

function App() {
  return (
    <Switch>
      <Route path="/" component={Scheduler} />
    </Switch>
  );
}

export default App;
