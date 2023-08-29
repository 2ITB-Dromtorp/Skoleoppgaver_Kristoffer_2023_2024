import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import './App.css';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X')
  }

  return <button className="square" onClick={handleClick}>{value}</button>;

}

function App() {

  return (
    <div className="App">
      <header className='App-header'>

        <div className="board-row">
          <Square />
          <Square />
          <Square />
        </div>
        <div className="board-row">
          <Square />
          <Square />
          <Square />
        </div>
        <div className="board-row">
          <Square />
          <Square />
          <Square />
        </div>

      </header>
    </div>
  );
}

export default App;