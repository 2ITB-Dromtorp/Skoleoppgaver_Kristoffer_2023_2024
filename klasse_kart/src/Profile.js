import { useNavigate, useParams } from 'react-router-dom';
const elever = require('./elever.json');

export default function Profile() {

    const navigate = useNavigate();

    let userId = useParams();

    let eleverListe = JSON.parse(JSON.stringify(elever))

    for (let i = 0; i < eleverListe.length; i++) {
        if (eleverListe[i].Fornavn.toLowerCase() === userId.profile) {
            return (
                <>
                    <div className='elev-container'>
                        <h1> Dette er profilen til {eleverListe[i].Fornavn} {eleverListe[i].Etternavn} </h1>
                        <h2> Email: {eleverListe[i].Email} </h2>
                        <button onClick={() => navigate(-1)}> Tilbake til hovedmeny </button>
                    </div>
                </>
            )
        } else if (i === (eleverListe.length - 1)) {
            console.log("feil bruekr")
            return (
                <p> denne brukeren fins ikke </p>
            )
        }
    }
}
