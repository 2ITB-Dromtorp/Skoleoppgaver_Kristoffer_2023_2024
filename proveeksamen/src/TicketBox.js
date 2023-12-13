import { useNavigate } from 'react-router-dom';

export function RenderPriority(props) {

    let className = ""

    console.log(props.Priority)

    switch (props.Priority) {
        case "Kritisk":
            className = "bg-red-500 font-semibold w-36 rounded-full border-2 p-3 relative text-center m-3"
            break;
        case "Stort":
            className = "bg-orange-500 font-semibold w-36 rounded-full border-2 p-3 relative text-center m-3"
            break;
        case "Liten":
            className = "bg-green-500 font-semibold w-36 rounded-full border-2 p-3 relative text-center m-3"
            break;
        case "Kosmetisk":
            className = "bg-green-400 font-semibold w-36 rounded-full border-2 p-3 relative text-center m-3"
            break;
    }

    return (
        <div className={className}>
            {props.Priority}
        </div>
    )
}

export default function TicketBox(props) {

    let Number = props.Number
    let Title = props.Title;
    let User = props.User;
    let Date = props.Date
    let Status = props.Status
    let Priority = props.Priority
    let path = props.Title

    const navigate = useNavigate();

    /*aconst checkPath = () => {
        if (name in list_of_students) {
            navigate(path);
        } else {
            console.log('Student dont exist')
        }
    } */

    return (


        <div className='TicketBox hover:bg-slate-300 cursor-pointer flex flex-row items-center rounded p-2 gap-6 justify-between bg-slate-200' onClick={() => navigate(path)}>

            <RenderPriority Priority={Priority} />

            <div className='flex flex-col w-full'>
                <div className='font-bold text-lg hover:text-underline'>
                    {Title}
                </div>

                <div className='flex flex-row gap-1 text-sm'>
                    <p>#{Number}</p>

                    <p>- Av</p>

                    <p>{User}</p>

                    <p>- Skrevet i </p>

                    <p>{Date}</p>

                </div>

            </div>

            <div className='bg-slate-300 m-3 p-3 w-64 text-center rounded'>
                <img src=''></img>
                <p>{Status}</p>
            </div>

        </div>


    )
}