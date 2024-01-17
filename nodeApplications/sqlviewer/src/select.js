import axios from "axios";
import { useState, useEffect } from "react";

export function Select() {

    const [data, setData] = useState([])

    useEffect(() => {
        runSQLCommands();
    }, [data])

    const runSQLCommands = async () => {
        axios
            .get("http://localhost:3500/sql", { headers: { 'Content-Type': 'application/json' } })
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
    )
}