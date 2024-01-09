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
            console.log(prevInputValues)
            const newInputValues = [...prevInputValues];
            if (newInputValues[index]) {
                newInputValues[index][fieldName] = value;
                console.log(newInputValues)
            }
            return newInputValues;
        });
    };

    useEffect(() => {
        setInputValues((prevInputValues) => {
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
            .then(response => {
                window.location.reload()
            })
            .catch(error => console.log(error));
    }

    const updateTable = async () => {

        const updatePromises = inputValues.map(async (currentData) => {
            if (currentData) {
                const { ElevID, Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn } = currentData;
                await updateSQL(Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn, ElevID);
            }
        });

        await Promise.all(updatePromises);


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
                    {data.length > 0 && data.map((data, index) => {
                        return <tr key={index}>
                            <td>{data.ElevID}</td>
                            <td><input type="text" onChange={(e) => handleInputChange(index, 'Fornavn', e.target.value)} defaultValue={data.Fornavn} ></input></td>
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

            <button onClick={() => runSQLCommands()}> show Table </button>

        </div>
    )
}