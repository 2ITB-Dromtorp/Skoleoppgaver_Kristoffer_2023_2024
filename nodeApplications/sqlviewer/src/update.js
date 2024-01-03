import { useState, useEffect } from "react";
import axios from "axios";

export function Update() {

    const [data, setData] = useState([])

    const [elevID, setelevID] = setState("")

    useEffect(() => {

        runSQLCommands("SELECT * FROM elev");
    }, [])

    const runSQLCommands = (sqlstring) => {
        axios
            .post("http://localhost:3500/sendSql", { command: sqlstring }, { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                setData(response.data)
            })
            .catch(error => console.log(error));
    }



    return (
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
                    {data.map((data, index) => {
                        return <tr key={index}>
                            <td><input type="text" placeholder={data.ElevID}></input></td>
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
    )
}