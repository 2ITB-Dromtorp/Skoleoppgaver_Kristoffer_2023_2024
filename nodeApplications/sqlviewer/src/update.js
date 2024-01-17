import { useState, useEffect } from "react";
import axios from "axios";

export function Update() {
    const [data, setData] = useState([])

    const [inputValues, setInputValues] = useState(() =>
        data.map(({ ElevID, Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn }) => ({
            ElevID,
            Fornavn: Fornavn || '',
            Etternavn: Etternavn || '',
            DatamaskinID: DatamaskinID || '',
            Hobby: Hobby || '',
            Klasse: Klasse || '',
            Kjonn: Kjonn || '',
        }))
    );

    const handleInputChange = (index, fieldName, value) => {
        setInputValues((prevInputValues) => {
            const newInputValues = [...prevInputValues];
            if (newInputValues[index]) {
                newInputValues[index][fieldName] = value;
            }
            return newInputValues;
        });
    };

    useEffect(() => {
        setInputValues(() => {
            const newInputValues = data.map(({ ElevID, Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn }) => ({
                ElevID,
                Fornavn: Fornavn || '',
                Etternavn: Etternavn || '',
                DatamaskinID: DatamaskinID || '',
                Hobby: Hobby || '',
                Klasse: Klasse || '',
                Kjonn: Kjonn || '',
            }));

            return newInputValues;
        });

    }, [data])

    const runSQLCommands = () => {
        axios
            .get("http://localhost:3500/sql", { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                setData(response.data)
            })
            .catch(error => console.log(error));
    }

    const updateSQL = (Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn, ElevID) => {
        axios
            .post("http://localhost:3500/updateSql", { Fornavn: Fornavn, Etternavn: Etternavn, DatamaskinID: DatamaskinID, Hobby: Hobby, Klasse: Klasse, Kjonn: Kjonn, ElevID: ElevID }, { headers: { 'Content-Type': 'application/json' } })
            .then(window.location.reload())
            .catch(error => console.log(error));
    }

    const updateTable = async () => {

        const updatePromises = inputValues.map(async (currentData) => {
            if (currentData) {
                const { ElevID, Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn } = currentData;
                updateSQL(Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn, ElevID);
            }
        });

        await Promise.all(updatePromises);

    };

    return (
        <div className="Content flex h-screen flex-col overflow-x-auto sm:mx-0.5 lg:mx-0.5 m-10">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <table className='w-full text-center'>
                    <thead className="bg-gray-200 border-b">
                        <tr>
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
                        {data.length > 0 && data.map((data, index) => {
                            return <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.ElevID}</td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap"><input className="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12" type="text" onChange={(e) => handleInputChange(index, 'Fornavn', e.target.value)} defaultValue={data.Fornavn} ></input></td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap"><input className="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12" type="text" onChange={(e) => handleInputChange(index, 'Etternavn', e.target.value)} defaultValue={data.Etternavn}></input></td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap"><input className="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12" type="text" onChange={(e) => handleInputChange(index, 'DatamaskinID', e.target.value)} defaultValue={data.DatamaskinID}></input></td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap"><input className="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12" type="text" onChange={(e) => handleInputChange(index, 'Hobby', e.target.value)} defaultValue={data.Hobby}></input></td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap"><input className="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12" type="text" onChange={(e) => handleInputChange(index, 'Klasse', e.target.value)} defaultValue={data.Klasse}></input></td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap"><input className="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12" type="text" onChange={(e) => handleInputChange(index, 'Kjonn', e.target.value)} defaultValue={data.Kjonn}></input></td>
                            </tr>
                        })}
                    </tbody>
                </table>

                <div className="flex flex-row gap-10">
                    <button className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={updateTable}>Update Table</button>

                    <button className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={() => runSQLCommands()}> show Table </button>

                </div>

            </div>

        </div>


    )
}