let randomNumber = Math.floor(Math.random() * 50);
export default function Oppgave4() {


    console.log(randomNumber)

    function checkifRight() {
        if (document.getElementById("numberInput").value == randomNumber) {
            console.log("riktig")
            document.getElementById("resutlttat").innerHTML = "du fikk riktig nummer"
        }
        else if (document.getElementById("numberInput").value > randomNumber) {
            document.getElementById("resutlttat").innerHTML = "altfor høy nummer"
        }
        else if (document.getElementById("numberInput").value < randomNumber) {
            document.getElementById("resutlttat").innerHTML = "altfor lav nummer"
        }

    }


    return (
        <>
            <h1> Oppgave 4 </h1>

            <label>Velg en tilfeldig number 1 til 50</label>
            <input type="text" onChange={() => checkifRight()} id="numberInput"></input>

            <p id="resutlttat"></p>

        </>
    )
}