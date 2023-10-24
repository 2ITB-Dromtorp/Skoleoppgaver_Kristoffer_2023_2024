import './App.css';
import Elev from './Elev';
import { useState } from 'react';
const elever = require('./elever.json');

export function RenderClassList() {

    const [searchInput, setSearchInput] = useState(''); // State for the search input

    // Function to handle changes in the search input
    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    let eleverListe = JSON.parse(JSON.stringify(elever))

    const filteredElev = eleverListe.filter((data) => {
        const fullName = `${data.Fornavn}`.toLowerCase();
        return fullName.includes(searchInput.toLowerCase());
    });

    return (
        <>

            <input
                type="text"
                id="blud"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchChange}
            />

            {filteredElev.map(function (data) {
                return (
                    <div>
                        <Elev name={data.Fornavn} />
                    </div>
                )
            })}
        </>
    )
}

export default function Home() {

    return (

        <div className="container">

            <select name="Sort" id="sort">
                <option value="Name">By name</option>
                <option value="Last">Last name</option>
            </select>

            <RenderClassList />

        </div>
    )
}