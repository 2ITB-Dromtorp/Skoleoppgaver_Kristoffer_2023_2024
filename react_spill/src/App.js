import './App.css';
import GridBoard from './components/GridBoard';
import NextBlock from './components/NextBlock';
import ScoreBoard from './components/ScoreBoard';

import React from 'react';
import { createStore } from 'redux'
import reducers from './reducers'

const store = createStore(reducers)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Gaming</h1>
      </header>
      <GridBoard props="1" />
      <NextBlock />
      <ScoreBoard />
    </div>
  );
}

export default App;
