
import { useState } from 'react';
import './App.css';
import { DigitalClock } from './DigitalKlokke';
import Confetti from 'react-confetti'

function App() {

  const [isExploding, setIsExploding] = useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <DigitalClock />

        <Confetti />
      </header>
    </div>
  );
}

export default App;
