import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TicketBox from "./TicketBox";

export default function Home() {

    const navigate = useNavigate();

    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filteredTickets, setFilteredTickets] = useState([]);

    useEffect(() => {

        const updatedFilteredTickets  = tickets.filter((ticket) => {
            if (!searchQuery || !filterType) {
                return true; // If no search query or filter type is set, show all tickets
            }
    
            // Implement specific filtering logic based on filterType
            switch (filterType) {
                case 'Number':
                    return ticket.Number;
                case 'Title':
                    return ticket.Title.toLowerCase().includes(searchQuery.toLowerCase());
                case 'Status':
                    return ticket.Status.toLowerCase().includes(searchQuery.toLowerCase());
                default:
                    return true; // Show all tickets if filter type is not recognized
            }
        });
        setFilteredTickets(updatedFilteredTickets);
    }, [searchQuery, filterType, tickets])


    return (
        <div className="Container flex flex-col h-screen bg-gray-100">

            <div className='Header w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <p>home</p>
                <button onClick={() => navigate("/create")}>Create</button>
            </div>

            <div className='Content flex justify-center items-center h-screen bg-gray-100 gap-3 '>

                <div className='Ticket w-6/12 h-5/6 bg-white gap-3 rounded p-6 space-y-4'>
                    <div>
                        <input type="text" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}></input>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option>Filter</option>
                                <option value="Number">By Number</option>
                                <option value="Title">By Title</option>
                                <option value="satus">By Status</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">

                        {filteredTickets.length > 0 && filteredTickets.map((data, index) => {
                            return <TicketBox Number={index} Title={data.Title} User={data.Name} Date={data.date} Priority={data.Priority} Status={data.Status} />
                        })}
                        

                    </div>
                </div>
            </div>

            <footer className='Footer bottom-0 w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear'>
                <p>Contact</p>
            </footer>
        </div>
    )
}