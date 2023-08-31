function Oppgave1A() {
    let test = 8
    console.log(test)
    return (
        <>
            <h3> A) Hva skriver du i javascript dersom du gir variablen "test" verdien 8, hvilken datatype er det</h3>

            <p> Svar: hvis du gir variablen "test" verdien 8 blir det til en int fordi det er en heltall og har ikke desimaler i seg (let test = 8)</p>
            {test}
        </>
    )
}

function Oppgave1B() {
    let test2 = "testverdi"
    console.log(test2)
    return (
        <>
            <h3> B) Hva skriver du dersom du gir variablen "test" verdien "testverdi" Hvilken datatype er det</h3>
            <p> Svar: når du gir en variablen verdien "testverdi" blir det til en string som betyr tekst (let test = "testverdi") </p>
            {test2}
        </>
    )
}

function Oppgave1C() {
    let produkt = 2 * 3
    console.log(produkt)
    return (
        <>
            <h3> C) Hva skriver du dersom du vil regne ut 2*3 og sette resultatet inn i variablen "produkt" </h3>
            <p> Svar: du må skrive (let produkt = 2*3)</p>
            {produkt}
        </>
    )
}

function Oppgave1D() {
    let broek = 2 / 3
    console.log(broek)
    return (
        <>
            <h3> D) Hva skriver du dersom du vil regne ut verdien av brøken 2/3 og sette resultatet i variablen "broek"  </h3>
            <p> Svar: (let broek = 2/3) </p>
            {broek}
        </>
    )

}

function Oppgave1E() {
    let produkt = 2 * 3
    console.log(produkt)
    return (
        <>
            <h3> E) Lag et program der du tester om alle kommandoene over fungerer ved å bruke console.log() til å skrive innholdet av variablen </h3>
            <p> Svar: (console.log(produkt)) konsolen vil printe ut </p>
            {produkt}
        </>
    )
}

export default function Oppgave1() {
    return (
        <>
            <h1>Oppgave 1 </h1>

            <Oppgave1A />

            <Oppgave1B />

            <Oppgave1C />

            <Oppgave1D />

            <Oppgave1E />
        </>
    )
}