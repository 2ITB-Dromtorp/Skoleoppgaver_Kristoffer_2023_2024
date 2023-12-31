import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './logogo.png'


function createTicket(Title, Description, Name, Priority, Email) {
    let data = JSON.parse(localStorage.getItem('tickets')) || [];
    const time = new Date();
    const date = time.getDate().toString() + "/" + time.getMonth().toString() + "/" + time.getFullYear().toString();
    let Status = "Ikke Fullført"

    // Add new ticket data
    const newTicket = { Title, Description, Name, date, Status, Priority, Email, "Number": data.length };
    data.push(newTicket);

    // Save updated data back to localStorage
    localStorage.setItem('tickets', JSON.stringify(data));

}

export default function CreateTicket() {

    let navigate = useNavigate()

    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");

    const HandleTicket = async () => {
        createTicket(Title, Description, Name, document.getElementById("priority").value, Email);

        navigate("/")
    };

    return (
        <div className="Container  flex flex-col h-screen bg-gray-100">

            <div className='Header w-full bg-white flex justify-between p-5 items-center transition-all duration-150 ease-linear'>
                <a href="/">
                <img src={logo} className="w-44"></img>
                </a>
                
                <button className="h-4/6 w-1/12 rounded font-bold text-white text-xl bg-gray-400 p-2" onClick={() => navigate("/")}>Tilbake</button>
            </div>

            <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-3">

                    <div className="login max-w-md w-full  bg-white gap-3 rounded p-6 space-y-4">
                        <label>
                            <p>Hva er problemet?</p>
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
                            <p>Email</p>
                            <input type="text" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setEmail(e.target.value)} />
                        </label>

                        <label>
                            <p>Avorlighetsgrad</p>
                            <select id="priority">
                                <option value="Kritisk">Kritisk</option>
                                <option value="Stort">Stort</option>
                                <option value="Liten">Liten</option>
                                <option value="Kosmetisk">Kosmetisk</option>
                            </select>
                        </label>
                        <div>
                            <button type="submit" onClick={HandleTicket} className="w-full py-4 bg-gray-400 hover:bg-gray-500 rounded text-sm font-bold text-gray-50 transition duration-200">
                                Submit </button>
                        </div>

                    </div>

            </div>
            <footer className='Footer bottom-0 w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <h2>Kontaktinformasjon</h2>
                <p>Adresse: Gateveien 123, 1234 Stedet</p>
                <p>Telefon: +47 123 45 678</p>
                <p>E-post: post@example.com</p>
            </footer>
        </div>
    )
}