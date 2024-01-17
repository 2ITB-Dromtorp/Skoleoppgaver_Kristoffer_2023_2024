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
        <div className="Content flex h-screen flex-col overflow-x-auto sm:mx-0.5 lg:mx-0.5 m-10">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8 ">
                <table className='min-w-full '>
                    <thead className="bg-gray-200 border-b ">
                        <tr className="">
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">ElevID</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Fornavn</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Etternavn</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">DatamaskinID</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Hobby</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Klasse</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Kjønn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((data, index) => {
                            return <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.ElevID}</td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">{data.Fornavn}</td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">{data.Etternavn}</td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">{data.DatamaskinID}</td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">{data.Hobby}</td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">{data.Klasse}</td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">{data.Kjonn}</td>


                            </tr>
                        })}
                    </tbody>
                </table>

            </div>

        </div>
    )
}