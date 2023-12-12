import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function TicketList() {

    const navigate = useNavigate();

    let profileParams = useParams();

    return (
        <>

            <div className='profile-box'>

                <h1>{profileParams.ticket} </h1>
                <button onClick={() => navigate(-1)}> Tilbake til hovedmeny </button>

            </div>
        </>
    )
}