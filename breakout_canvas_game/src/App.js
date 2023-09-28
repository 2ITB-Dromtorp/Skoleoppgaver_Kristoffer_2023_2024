
import './App.css';

function App() {

  function startGame() {
    myGameArea.start();
  }

  var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
      this.canvas.width = 480;
      this.canvas.height = 270;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0].firstChild.firstChild);
      this.frameNo = 0;
    },
    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1> spillet går her </h1>
        </div>

        <button onClick={() => startGame()}>start game</button>
      </header>
    </div>
  );
}


export default App;
