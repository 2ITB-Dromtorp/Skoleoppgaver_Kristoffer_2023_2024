import './App.css';
import { useState } from 'react';


function App() {

  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <div id="Counterbox">
          <button onClick={() => setCount(count + 1)}>Increase</button>
          <h1>{count}</h1>
          <button onClick={() => setCount(count - 1)}>Decrease</button>

        </div>

      </header>
    </div>
  );
}

export default App;
