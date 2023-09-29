import { useNavigate, useParams } from 'react-router-dom';
const elever = require('./elever.json');



export function checkifUserExist() {

    let eleverListe = JSON.parse(JSON.stringify(elever))

    for (let i = 0; i < eleverListe.Elever.length; i++) {
        if (eleverListe.Elever[i].Fornavn.toLowerCase() === userId.profile) {
            return (
                <>
                    <div className='elev-container'>
                        <h1> Dette er profilen til {userId.profile} </h1>
                        <button onClick={() => navigate(-1)}> Tilbake til hovedmeny </button>
                    </div>
                </>
            )
        } else {
            console.log("feil bruekr")
            return (
                <p> denne brukeren fins ikke </p>
            )
        }
    }


}


export default function Profile() {

    const navigate = useNavigate();

    let userId = useParams();

    return (
        <>
            <checkifUserExist />
        </>

    )
}