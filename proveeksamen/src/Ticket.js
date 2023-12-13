import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function changeStatus(params, newStatus) {
    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].Title.includes(params.ticket)) {
            tickets[i].Status = newStatus
            break;
        }
    }

    // Save updated data back to localStorage
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

export default function TicketList() {

    const navigate = useNavigate();

    let profileParams = useParams();

    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    let data = null

    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].Title.includes(profileParams.ticket)) {
            data = tickets[i]
            break;
        }
    }

    if (!data) {
        return <p>Doesn't exist</p>;
    }

    return (
        <div className="Container flex flex-col h-screen bg-gray-100">

            <div className='Header w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <p>home</p>
                <button onClick={() => navigate("/create")}>Create</button>
            </div>

            <div className='Content flex flex-col p-5 justify-center items-center h-screen bg-gray-100 gap-3 '>
                <h1 className='text-4xl font-bold'>{profileParams.ticket} - #{data.Number} </h1>

                <div className='flex flex-row justify-between bg-white w-7/12 h-4/6 p-5'>

                    <div className='bg-slate-200 w-8/12'>
                        <h1>Beskrivelse:</h1>
                        {data.Description}

                    </div>

                    <div className='bg-slate-200 flex flex-col gap-4 w-3/12'>

                        <div>
                            <h1>Dato</h1>
                            {data.date}
                        </div>

                        <div>
                            <h1>Status</h1>
                            <select id="StatusChange" onChange={() => { changeStatus(profileParams, document.getElementById("StatusChange").value) }}>
                                <option>Ikke Fullført</option>
                                <option>Jobber med dette</option>
                                <option>Fullført</option>
                            </select>
                            {data.Status}
                        </div>

                        <div>
                            <h1>Email</h1>
                            {data.Email}
                        </div>

                    </div>

                </div>


                <button onClick={() => navigate(-1)}> Tilbake til hovedmeny </button>
            </div>



            <footer className='Footer bottom-0 w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <h2>Kontaktinformasjon</h2>
                <p>Adresse: Gateveien 123, 1234 Stedet</p>
                <p>Telefon: +47 123 45 678</p>
                <p>E-post: post@example.com</p>
            </footer>
        </div >
    )
}