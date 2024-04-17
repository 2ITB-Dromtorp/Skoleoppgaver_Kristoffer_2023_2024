import { useState } from "react"
import axios from "axios";

export default function Signup() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("None")
    const [adress, setAdress] = useState("")
    const [city, setCity] = useState("")
    const [schoolclass, setSchoolClass] = useState("None")

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                email: email,
                password: password,
                role: role,
                class_id: schoolclass,
                contact_info: {
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                    adress: adress,
                    city: city
                }
            };
            const response = await axios.post("http://localhost:8080/api/signup", userData);
            console.log("User signed up:", response);
        } catch (error) {
            console.error("Signup failed:", error.response.data);
        }
    }

    return (
        <div>
                <form>
                    <label>
                        Email
                    </label>
                    <input type="text" required={true} onChange={e => setEmail(e.target.value)} />

                    <label>
                        Passord
                    </label>
                    <input type="text" minLength={8} required={true} onChange={e => setPassword(e.target.value)} />

                    <label>
                        Fornavn
                    </label>
                    <input type="text" required={true} onChange={e => setFirstname(e.target.value)} />

                    <label>
                        Etternavn
                    </label>
                    <input type="text" required={true} onChange={e => setLastname(e.target.value)} />

                    <label>
                        Telefon nummer
                    </label>
                    <input type="text" required={true} onChange={e => setPhone(e.target.value)} />

                    <label>
                        Adress
                    </label>
                    <input type="text" required={true} onChange={e => setAdress(e.target.value)} />

                    <label>
                        City
                    </label>
                    <input type="text" required={true} onChange={e => setCity(e.target.value)} />

                    <select required={true} onChange={(e)=>setRole(e.target.value)} value={role}>
                        <option value="None">Velg rollen</option>
                        <option value="Teacher">Lærer</option>
                        <option value="Student">Elev</option>
                    </select>

                    <select required={true} onChange={(e)=>setSchoolClass(e.target.value)} value={schoolclass}>
                        <option value="None">Velg klasse</option>
                        <option value="2ITB">2ITB</option>
                        <option value="2ITA">2ITA</option>
                        <option value="IM">IM</option>
                    </select>

                    <button type="submit" onClick={handleSignup} className="w-full py-4 bg-gray-400 hover:bg-gray-500 rounded text-sm font-bold text-gray-50 transition duration-200">
                        Submit </button>

                </form>

        </div>
    )
}