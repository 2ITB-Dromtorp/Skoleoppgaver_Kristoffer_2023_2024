import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function TicketList() {

    const navigate = useNavigate();

    let profileParams = useParams();

    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    console.log(tickets)
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

                <div className='Content flex flex-col justify-center items-center h-screen bg-gray-100 gap-3 '>
                    <h1 className='text-6xl'>{profileParams.ticket} </h1>

                    <div className='flex flex-row justify-between w-7/12 h-5/6 p-5'>

                        <div className='bg-gray-400 w-8/12'>
                            {data.Description}
                            
                        </div>

                        <div className='bg-gray-400 w-3/12'>
                            <h1>Dato</h1>
                            {data.date}
                            <h1>Status</h1>
                            {data.Status}
                        </div>

                    </div>


                    <button onClick={() => navigate(-1)}> Tilbake til hovedmeny </button>
                </div>



                <footer className='Footer bottom-0 w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                    <p>Contact</p>
                </footer>
            </div>
    )
}