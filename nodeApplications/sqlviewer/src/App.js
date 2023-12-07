import { useEffect, useState } from 'react';
import './App.css';

export async function runSQLCommand(sqlstring) {
  fetch('http://localhost:3500//sendSql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: sqlstring
  })
    .then((response) => response.text())
    .then((response) => {
      return response
    })
}



function App() {

  const [sqlCommand, setSqlCommand] = useState([])
  const [sqlData, setSqlData] = useState([])

  useEffect(() => {
    async function getData() {
      fetch("http://localhost:3500/sql")
        .then(response => response.json())
        .then(data => { setSqlData(data) });
    }
    getData()
  }, [])

  return (

    <div className="Container flex flex-col h-screen bg-gradient-to-r from-cyan-500 to-blue-500">

      <div className="Navbar w-full bg-white flex justify-between p-5 items-center shadow-2xl">
        <button className=''>Select</button>
        <button className=''>Update</button>
        <button className=''>Insert</button>
        <button className=''>Delete</button>
      </div>
      <input type="text" id="sql" placeholder='skriv shit'></input>
      <button onClick={ }>submit</button>

      <div className="Content flex h-screen flex-col m-10 bg-gray-200">

        {sqlData.length > 0 && sqlData.map((data) => {
          return <p>{data.Model}</p>
        })}
      </div>

    </div>
  );
}

export default App;
