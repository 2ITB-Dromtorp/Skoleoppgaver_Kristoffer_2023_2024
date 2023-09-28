export function Page1() {

    async function logMovies() {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
        const jokes = await response.json();
        document.getElementById("joke").innerHTML = jokes.joke
    }

    return (
        <>
            <p id="joke">Joke goes here</p>
            <button onClick={() => logMovies()}>press for joke API</button>
        </>
    )
}