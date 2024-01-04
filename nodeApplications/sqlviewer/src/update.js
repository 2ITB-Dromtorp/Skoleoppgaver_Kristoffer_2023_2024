import { useState, useEffect } from "react";
import axios from "axios";

export function Update() {
    const [data, setData] = useState([])

    const [inputValues, setInputValues] = useState(data.map(({ ElevID, Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn }) => ({
        ElevID,
        Fornavn: Fornavn || '',
        Etternavn: Etternavn || '',
        DatamaskinID: DatamaskinID || '',
        Hobby: Hobby || '',
        Klasse: Klasse || '',
        Kjonn: Kjonn || '',
    })));


    const handleInputChange = (index, fieldName, value) => {
        const newInputValues = [...inputValues];

        if (newInputValues[index]) {
            newInputValues[index][fieldName] = value;
            setInputValues(newInputValues);
        }
    };

    useEffect(() => {
        setInputValues(
            data.map(({ ElevID, Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn }) => ({
                ElevID,
                Fornavn,
                Etternavn: Etternavn || '',
                DatamaskinID: DatamaskinID || '',
                Hobby: Hobby || '',
                Klasse: Klasse || '',
                Kjonn: Kjonn || '',
            }))
        );
        runSQLCommands("SELECT * FROM elev");
    }, [data])

    const runSQLCommands = (sqlstring) => {
        axios
            .post("http://localhost:3500/sendSql", { command: sqlstring }, { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                setData(response.data)
            })
            .catch(error => console.log(error));
    }

    const updateSQL = (sqlstring) => {
        axios
            .post("http://localhost:3500/updateSql/", { command: sqlstring }, { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                window.location.reload()
            })
            .catch(error => console.log(error));
    }

    const updateTable = async () => {
        for (let i = 0; i < inputValues.length; i++) {
            const currentData = inputValues[i];
            if (currentData) {
                const { ElevID, Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn } = currentData;
                const sqlstring = `UPDATE elev SET Fornavn = '${Fornavn}', Etternavn = '${Etternavn}', DatamaskinID = '${DatamaskinID}', Hobby = '${Hobby}', Klasse = '${Klasse}', Kjonn = '${Kjonn}' WHERE ElevID = ${ElevID}`;
                // Assuming your updateSQL function is defined somewhere to execute the SQL statement
                // updateSQL(sqlstring);
                updateSQL(sqlstring)
            }
        }
    };

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
                            <td><input type="text" onChange={(e) => handleInputChange(index, 'Fornavn', e.target.value)} defaultValue={data.Fornavn}></input></td>
                            <td><input type="text" onChange={(e) => handleInputChange(index, 'Etternavn', e.target.value)} defaultValue={data.Etternavn}></input></td>
                            <td><input type="text" onChange={(e) => handleInputChange(index, 'DatamaskinID', e.target.value)} defaultValue={data.DatamaskinID}></input></td>
                            <td><input type="text" onChange={(e) => handleInputChange(index, 'Hobby', e.target.value)} defaultValue={data.Hobby}></input></td>
                            <td><input type="text" onChange={(e) => handleInputChange(index, 'Klasse', e.target.value)} defaultValue={data.Klasse}></input></td>
                            <td><input type="text" onChange={(e) => handleInputChange(index, 'Kjonn', e.target.value)} defaultValue={data.Kjonn}></input></td>
                        </tr>
                    })}
                </tbody>
            </table>

            <button onClick={updateTable}>Update Table</button>

        </div>
    )
}