import { useEffect, useState } from 'react';
import './App.css';




function App() {

  const [sqlCommand, setSqlCommand] = useState("")
  const [sqlData, setSqlData] = useState([])
  const [content, setContent] = useState()

  useEffect(() => {
    /*async function getData() {
      fetch("http://localhost:3500/sql")
        .then(response => response.json())
        .then(data => { setSqlData(data) });
    }
    getData()*/
  }, [])

  async function runSQLCommand(sqlstring) {
    fetch('http://localhost:3500/sendSql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: sqlstring })
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        setSqlData(response)
      })
  }


  const select = async () => {
    await runSQLCommand("SELECT * FROM datamaskin")
    console.log(sqlData)
  };

  const runSQL = async () => {
    await runSQLCommand(sqlCommand)
    console.log(sqlData)
  };

  return (

    <div className="Container flex flex-col h-screen bg-gradient-to-r from-cyan-500 to-blue-500">

      <div className="Navbar w-full bg-white flex justify-between p-5 items-center shadow-2xl">
        <button onClick={select}>Select</button>
        <button >Update</button>
        <button >Insert</button>
        <button >Delete</button>
      </div>
      <input type="text" id="sql" onChange={e => setSqlCommand(e.target.value)} placeholder='skriv shit'></input>
      <button onClick={runSQL}>submit</button>

      <div className="Content flex h-screen flex-col m-10 bg-gray-200">
        {sqlData.length > 0 && sqlData.map((data, index) => {
          return <div key={index}>
            {data.DatamaskinID}
            {data.Model}
            {data.GBram}
          </div>
        })}
      </div>

    </div>
  );
}

export default App;
