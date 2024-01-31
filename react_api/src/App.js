
import './App.css';

async function jokeAPI() {
  const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=twopart");
  const movies = await response.json();
  document.getElementById("Setup").innerHTML = JSON.stringify(movies.setup)
  document.getElementById("Delivery").innerHTML = JSON.stringify(movies.delivery)
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => jokeAPI()}>Press for Joke</button>
        <div id="Setup"></div>
        <div id="Delivery"></div>
      </header>
    </div >
  );
}

export default App;
