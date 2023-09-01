import { useState } from "react"
export default function Oppgave5() {

    let guessedNumberArray = []
    let guessedNumber = 25
    let numberofguess = 0
    const [userNumberInput, setUserNumberInput] = useState(0)

    function numberGuess() {

        while (guessedNumber != userNumberInput) {

            if (guessedNumber < userNumberInput) {
                guessedNumber = Math.round(guessedNumber + 25 / (2 ** numberofguess))
            } else if (guessedNumber > userNumberInput) {
                guessedNumber = Math.round(guessedNumber - 25 / (2 ** numberofguess))
            }
            numberofguess++
            guessedNumberArray.push(guessedNumber)
            console.log(guessedNumber)

        }

        for (let i = 0; i < guessedNumberArray.length; i++) {
            document.getElementById("resultati").innerHTML += guessedNumberArray[i] + ", "
        }

        document.getElementById("resultati2").innerHTML = "programmet gjetta riktig number"


    }

    return (
        <>
            <h1> Oppgave 5 </h1>

            <label>skriv en nummer 1 til 50 og la datamaskinen gjette det </label>

            <input type="text" id="numberInput" onChange={e => setUserNumberInput(e.target.value)}></input>

            <input type="button" onClick={() => numberGuess()} value="Submit" ></input>

            <p id="resultati"></p>
            <p id="resultati2"></p>

        </>
    )
}