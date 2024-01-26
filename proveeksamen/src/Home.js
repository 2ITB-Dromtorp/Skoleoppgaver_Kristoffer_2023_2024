import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TicketBox from "./TicketBox";
import logo from './logogo.png'

export default function Home() {

    const navigate = useNavigate();

    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filteredTickets, setFilteredTickets] = useState([]);

    useEffect(() => {

        const updatedFilteredTickets = tickets
            .filter((ticket) => {
                if (!searchQuery) {
                    return true; // If no search query or filter type is set, show all tickets
                }

                // Implement specific filtering logic based on filterType
                switch (filterType) {
                    case 'Number':
                        return ticket.Number.toString().includes(searchQuery);
                    case 'Title':
                        return ticket.Title.toLowerCase().includes(searchQuery.toLowerCase());
                    case 'Status':
                        return ticket.Status.toLowerCase().includes(searchQuery.toLowerCase());
                    case 'Priority':
                        return ticket.Priority.toLowerCase().includes(searchQuery.toLowerCase());
                    default:
                        return true; // Show all tickets if filter type is not recognized
                }
            })
            .sort((a, b) => {
                // Sort based on Title and Number
                if (filterType === 'Title') {
                    return a.Title.localeCompare(b.Title);
                } else if (filterType === 'Number') {
                    return parseInt(a.Number) - parseInt(b.Number);
                } else if (filterType === 'Priority') {
                    const priorityOrder = { 'Kritisk': 1, 'Stort': 2, 'Liten': 3, 'Kosmetisk': 4 };
                    return priorityOrder[a.Priority] - priorityOrder[b.Priority];
                }
                return 0;
            });
        setFilteredTickets(updatedFilteredTickets);
    }, [searchQuery, filterType])


    return (
        <div className="Container flex flex-col h-screen bg-gray-100">

            <div className='Header w-full bg-white flex justify-between p-5 items-center transition-all duration-150 ease-linear'>
                <a href="/">
                    <img src={logo} className="w-44"></img>
                </a>

                <button className="h-4/6 w-1/12 rounded font-bold text-white text-xl bg-green-400 p-2" onClick={() => navigate("/create")}>Rapporter</button>
            </div>

            <div className='Content flex flex-col justify-center items-center h-screen bg-gray-100 gap-3 '>
                <div className="flex flex-row h-max" >
                    <input type="text" className="w-full" value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}></input>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option>Sorter</option>
                        <option value="Number">Nummer</option>
                        <option value="Title">Alfabetisk</option>
                        <option value="Priority">Prioritet</option>
                        <option value="Status">Status</option>
                    </select>
                </div>
                <div className='Ticket w-6/12 h-5/6 overflow-auto bg-white gap-3 rounded p-6 space-y-4  shadow-xl'>

                    <div className="flex flex-col gap-2 h-full ">

                        {filteredTickets.length > 0 && filteredTickets.map((data) => {
                            return <TicketBox Number={data.Number} Title={data.Title} User={data.Name} Date={data.date} Priority={data.Priority} Status={data.Status} />
                        })}

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