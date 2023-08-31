export default function Oppgave3() {

    function språk() {
        if (document.getElementById("språk").value === "n") {
            document.getElementById("resultat2").innerHTML = "Du er norsk"
            document.getElementById("tekst").innerHTML = "skriv enten n eller s"
        } else if (document.getElementById("språk").value === "s") {
            document.getElementById("resultat2").innerHTML = "Du är svensk"
            document.getElementById("tekst").innerHTML = "skriv antingen n eller s"
        } else {
            document.getElementById("resultat2").innerHTML = "du må skrive riktig"
        }
    }

    return (
        <>
            <h1>Oppgave 3</h1>

            <label id="tekst">skriv enten n eller s</label>
            <input type="text" onChange={() => språk()} id="språk"></input>

            <p id="resultat2"></p>

        </>


    )
}