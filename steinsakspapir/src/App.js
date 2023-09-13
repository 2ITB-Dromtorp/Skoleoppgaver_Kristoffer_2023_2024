
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
      return "Tie"
    }
    if (Player2 === "Saks") {
      return "Lose"
    }
    if (Player2 === "Stein") {
      return "Win"
    }
  }
}

function chooseWeapon(weapon) {
  Player1 = weapon.target.value
  Player2 = enemyRandom()
  document.getElementById("P1Image").src = require("./" + Player1 + ".jpg")
  document.getElementById("P2Image").src = require("./" + Player2 + ".jpg")
  switch (Battle()) {
    case "Win":
      document.getElementById("status").innerHTML = "Player vant"
      break;
    case "Lose":
      document.getElementById("status").innerHTML = "Slem robot vant"
      break;
    case "Tie":
      document.getElementById("status").innerHTML = "Ingen vant"
      break;
    default:
      document.getElementById("status").innerHTML = "bruh"
      break;
  }
}




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Stein Saks papir </h1>

        <div id="Battlefield">

          <div id="Player1">
            <h1>Player</h1>
            <img src="" id="P1Image" alt="p1"></img>
          </div>
          <div id="Player2">
            <h1>Slem Robot</h1>
            <img src="" id="P2Image" alt="p2"></img>
          </div>
        </div>

        <h3 id="status"></h3>

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
