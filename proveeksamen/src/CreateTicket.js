import { useState } from "react";


function createTicket(Title, Description, Name) {
    let data = require('./tickets.json');

    data.push(Title, Description, Name)

}

export default function CreateTicket() {

    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Name, setName] = useState("");

    const HandleTicket = async () => {
        createTicket(Title, Description, Name);
    };

    return (
        <div className="App">

            <div className='Header Header w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <p>home</p>
            </div>

            <div className='Container'>
                <div className="flex justify-center items-center h-screen bg-gray-100 gap-3">

                    <p>Create Ticket</p>

                    <div className="login max-w-md w-full bg-white gap-3 rounded p-6 space-y-4">
                        <label>
                            <p>Tittel</p>
                            <input type="text" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setTitle(e.target.value)} />
                        </label>
                        <label>
                            <p>Lang beskrivelse av problemet</p>
                            <textarea className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setDescription(e.target.value)} />
                        </label>

                        <label>
                            <p>Navnet ditt</p>
                            <input type="text" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setName(e.target.value)} />
                        </label>
                        <label>
                            <p>Hvor stor er problemet?</p>
                            <select id="cars" name="cars">
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </label>
                        <div>
                            <button type="submit" onClick={{ HandleTicket }} className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200">
                                Submit </button>
                        </div>

                    </div>

                </div>


            </div>
            <footer className='Footer'>
                <p>Contact</p>
            </footer>
        </div>
    )
}