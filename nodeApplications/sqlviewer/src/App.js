import { useEffect, useState } from 'react';
import './App.css';

import axios from "axios";



function App() {

  const [sqlCommand, setSqlCommand] = useState("")
  const [sqlData, setSqlData] = useState([])

  useEffect(() => {
    /*async function getData() {
      fetch("http://localhost:3500/sql")
        .then(response => response.json())
        .then(data => { setSqlData(data) });
    }
    getData()*/
  }, [])

  async function runSQLCommands(sqlstring) {
    axios
      .post("http://localhost:3500/sendSql", { command: sqlstring }, { headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        setSqlData(response.data)
      })
      .catch(error => console.log(error));
  }



  const select = async () => {
    await runSQLCommands("SELECT * FROM elev")
    console.log(sqlData)
  };

  const runSQL = async () => {
    await runSQLCommands(sqlCommand)
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
        <table className='w-full text-center'>
          <thead>
            <tr>
              <th>ElevID</th>
              <th>Fornavn</th>
              <th>Etternavn</th>
              <th>DatamaskinID</th>
              <th>Hobby</th>
              <th>Klasse</th>
              <th>Kjønn</th>
            </tr>
          </thead>
          <tbody>
            {sqlData.map((data, index) => {
              return <tr key={index}>
                <td>{data.ElevID}</td>
                <td>{data.Fornavn}</td>
                <td>{data.Etternavn}</td>
                <td>{data.DatamaskinID}</td>
                <td>{data.Hobby}</td>
                <td>{data.Klasse}</td>
                <td>{data.Kjonn}</td>


              </tr>
            })}
          </tbody>
        </table>

      </div>

    </div >
  )
}

export default App;
