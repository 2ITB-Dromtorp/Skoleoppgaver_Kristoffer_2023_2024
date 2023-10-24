import { useNavigate } from 'react-router-dom';

export default function Elev(props) {

    let name = props.name;
    let path = props.name.toLowerCase();

    const navigate = useNavigate();

    return (
        <div className='profile-container'>
            <div className='box'>
                <div className='elev' onClick={() => navigate(path)}> {name} </div>
            </div>
        </div>
    )
}