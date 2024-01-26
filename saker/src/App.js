import logo from './logo.svg';
import './App.css';


function App() {

  const FetchStuff = async () => {

    axios
      .get("/get")
      .catch(error => console.log(error));

  }

  return (
    <div className="App">

      <button ></button>

    </div>
  );
}

export default App;
