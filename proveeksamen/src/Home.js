import { useNavigate } from "react-router-dom";
import TicketBox from "./TicketBox";

export default function Home() {

    const navigate = useNavigate();


    return (
        <div className="Container flex flex-col h-screen bg-gray-100">

            <div className='Header w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <p>home</p>
                <button onClick={() => navigate("/create")}>Create</button>
            </div>

            <div className='Content flex justify-center items-center h-screen bg-gray-100 gap-3 '>


                <div className='Ticket max-w-md  bg-white gap-3 rounded p-6 space-y-4 '>
                    <div>
                        <p>Ticket</p>
                    </div>
                    <div className="flex flex-col">

                        <TicketBox Number="1" Title="Test" User="Halla" Date="01/22/2313" Priority="Kritisk" Status="Test" />

                    </div>
                </div>
            </div>

            <footer className='Footer absolute bottom-0 w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <p>Contact</p>
            </footer>
        </div>
    )
}