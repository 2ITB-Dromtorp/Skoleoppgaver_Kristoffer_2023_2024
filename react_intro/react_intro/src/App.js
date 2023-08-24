import './App.css';

function Square({ value }) {
  return <button className="square">{value}</button>
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
          <Square value={"x"} />
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