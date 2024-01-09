import { useState, useEffect } from "react";
import axios from "axios";

export function Insert() {

    const [InputValues, setInputValues] = useState({
        Fornavn: "",
        Etternavn: "",
        DatamaskinID: "",
        Hobby: "",
        Klasse: "",
        Kjonn: "",
    })

    const handleInputChange = (fieldName, value) => {
        setInputValues((prevInputValues) => {
            let newInputValues = prevInputValues
            newInputValues[fieldName] = value;
            return newInputValues;
        });
        console.log(InputValues)
    };

    const InsertSQL = (Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn, ElevID) => {
        axios
            .post("http://localhost:3500/InsertSQL", { Fornavn: Fornavn, Etternavn: Etternavn, DatamaskinID: DatamaskinID, Hobby: Hobby, Klasse: Klasse, Kjonn: Kjonn, ElevID: ElevID }, { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                window.location.reload()
            })
            .catch(error => console.log(error));
    }

    return (
        <div className="Content flex h-screen flex-col m-10 bg-gray-200">
            <h1>Insert new data</h1>

            <div className="flex flex-row m-1 gap-2">
                <div>
                    <p>Fornavn</p>
                    <input onChange={(e) => handleInputChange('Fornavn', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p>Etternavn</p>
                    <input onChange={(e) => handleInputChange('Etternavn', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p>Klasse</p>
                    <input onChange={(e) => handleInputChange('Klasse', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p>Hobby</p>
                    <input onChange={(e) => handleInputChange('Hobby', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p>Kjønn</p>
                    <input onChange={(e) => handleInputChange('Kjonn', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p>DatamaskinID</p>
                    <input onChange={(e) => handleInputChange('DatamaskinID', e.target.value)} type="text"></input>
                </div>

            </div>

            <button>Submit</button>

        </div>
    )
}