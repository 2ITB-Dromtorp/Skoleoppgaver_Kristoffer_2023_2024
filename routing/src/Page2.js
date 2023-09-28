export function Page2() {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        document.getElementById("location").innerHTML = "Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude;
    }

    return (
        <>
            <h1>your location is</h1>
            <button onClick={() => getLocation()}>show location</button>
            <h2 id="location"></h2>
        </>
    )
}