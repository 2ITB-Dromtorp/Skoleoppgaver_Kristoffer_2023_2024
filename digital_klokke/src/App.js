

import './App.css';
import { DigitalClock } from './DigitalKlokke';
import Confetti from 'react-confetti'

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <DigitalClock />

        <Confetti
          numberOfPieces={400}
        />
      </header>
    </div>
  );
}

export default App;
