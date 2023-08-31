function Oppgave2A() {

    function arealRektangel(lengde, bredde) {
        return lengde * bredde
    }

    return (
        <>
            <h3> A) Lag et program som regner ut arealet av et rektangel. Lengden er 8 og bredden er 8. skriv dette som en funksjon i python</h3>
            <p>
                Python:
                def arealRektangel(lengde, bredde):
                return lengde * bredde
            </p>
            <p>
                javascript:
                function arealRektangel(lengde, bredde) [
                return lengde * bredde
                ]


            </p>
            {arealRektangel(8, 8)}
        </>
    )
}

function Oppgave2B() {
    function trekantAreal(Lengde, Bredde) { return (Lengde * Bredde) / 2 }

    return (
        <>
            <h3> B) Lag et program som regner ut arealet av en trekant</h3>
            <p> function trekantAreal(Lengde, Bredde) [
                return (Lengde * Bredde) / 2
                ]
            </p>
            <p>Lengden er 10 og bredden er 4</p>
            {trekantAreal(10, 4)}
        </>
    )
}

function Oppgave2C() {

    function areal() {
        document.getElementById("resultatRektangel").innerHTML = (document.getElementById("lengde").value * document.getElementById("bredde").value)
        document.getElementById("resultatTrekant").innerHTML = ((document.getElementById("lengde").value * document.getElementById("bredde").value) / 2)
    }

    return (
        <>
            <h3> C) Lag en program som heter areal(lengde, bredde) med 2 input parametere </h3>

            <p>Rektangel areal </p>
            <label>Lengde</label>
            <input type="text" onChange={() => areal()} id="lengde"></input>
            <label>Bredde</label>
            <input type="text" onChange={() => areal()} id="bredde"></input>
            <label>rektangel</label>
            <p id="resultatRektangel"></p>
            <label>trekant</label>
            <p id="resultatTrekant"></p>
        </>
    )
}

export default function Oppgave2() {
    return (

        <>
            <h1> Oppgave 2 </h1>
            <Oppgave2A />
            <Oppgave2B />
            <Oppgave2C />
        </>




    )
}