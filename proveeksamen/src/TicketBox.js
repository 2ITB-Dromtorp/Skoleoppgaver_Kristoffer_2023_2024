import { useNavigate } from 'react-router-dom';

export default function TicketBox(props) {

    let Number = props.Number
    let Title = props.Title;
    let User = props.User;
    let Date = props.Date
    let Status = props.Status
    let Priority = props.Priority
    let path = props.Title.toLowerCase();

    const navigate = useNavigate();

    /*aconst checkPath = () => {
        if (name in list_of_students) {
            navigate(path);
        } else {
            console.log('Student dont exist')
        }
    } */

    return (


        <div className='TicketBox flex flex-row justify-center bg-slate-200' onClick={() => navigate(path)}>

            <div className='p-2'>
                {Status}
            </div>


            <div className='flex flex-col'>
                <div>
                    {Title}
                </div>

                <div className='flex flex-row'>
                    {Number}
                    {User}
                    {Date}
                </div>

            </div>

            {Priority}


        </div>


    )
}