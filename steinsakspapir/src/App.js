
import './App.css';

let enemyWeapons = ["Stein", "Saks", "Papir"]
let Player1 = ""
let Player2 = ""

function enemyRandom() {
  return enemyWeapons[Math.floor(Math.random() * enemyWeapons.length)];
}

function Battle() {
  if (Player1 === "Stein") {
    if (Player2 === "Papir") {
      return "Lose"
    }
    if (Player2 === "Saks") {
      return "Win"
    }
    if (Player2 === "Stein") {
      return "Tie"
    }
  }
  else if (Player1 === "Saks") {
    if (Player2 === "Papir") {
      return "Win"
    }
    if (Player2 === "Saks") {
      return "Tie"
    }
    if (Player2 === "Stein") {
      return "Lose"
    }
  }
  else if (Player1 === "Papir") {
    if (Player2 === "Papir") {

    }
    if (Player2 === "Saks") {

    }
    if (Player2 === "Stein") {

    }
  }
}

function chooseWeapon(weapon) {
  Player1 = weapon
  Player2 = enemyRandom()
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Stein Saks papir </h1>
        <div id="Battlefield">
          <div id="Player1">
            <h1>Player 1</h1>
            <img src="stein.jpg" id="P1Image" alt="p1"></img>
          </div>
          <div id="Player2">
            <h1>Player 2</h1>
            <img src="./stein.jpg" id="P2Image" alt="p2"></img>
          </div>
        </div>

        <div id="Buttons">
          <button value="Stein" onClick={(value) => chooseWeapon(value)}>Stein</button>
          <button value="Saks" onClick={(value) => chooseWeapon(value)}>Saks</button>
          <button value="Papir" onClick={(value) => chooseWeapon(value)}>Papir</button>
        </div>
      </header>
    </div>
  );
}

export default App;
