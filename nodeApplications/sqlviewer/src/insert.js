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
    const InsertSQL = () => {
        axios
            .post("http://localhost:3500/insertsql", { Fornavn: InputValues.Fornavn, Etternavn: InputValues.Etternavn, DatamaskinID: InputValues.DatamaskinID, Hobby: InputValues.Hobby, Klasse: InputValues.Klasse, Kjonn: InputValues.Kjonn }, { headers: { 'Content-Type': 'application/json' } })
            .then(window.location.reload())
            .catch(error => console.log(error));
    }

    return (
        <div className="Content flex h-screen flex-col justify-center place-content-center">

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex m-4 flex-col gap-8 w-5/12">
                <div>
                    <p className="block text-grey-darker text-sm font-bold mb-2">Fornavn</p>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" onChange={(e) => handleInputChange('Fornavn', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p className="block text-grey-darker text-sm font-bold mb-2">Etternavn</p>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" onChange={(e) => handleInputChange('Etternavn', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p className="block text-grey-darker text-sm font-bold mb-2">Klasse</p>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" onChange={(e) => handleInputChange('Klasse', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p className="block text-grey-darker text-sm font-bold mb-2">Hobby</p>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" onChange={(e) => handleInputChange('Hobby', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p className="block text-grey-darker text-sm font-bold mb-2">Kjønn</p>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" onChange={(e) => handleInputChange('Kjonn', e.target.value)} type="text"></input>
                </div>

                <div>
                    <p className="block text-grey-darker text-sm font-bold mb-2">DatamaskinID</p>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" onChange={(e) => handleInputChange('DatamaskinID', e.target.value)} type="text"></input>
                </div>

                <button className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={InsertSQL}>Submit</button>


            </div>


        </div>
    )
}