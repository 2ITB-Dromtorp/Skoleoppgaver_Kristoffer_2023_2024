import { useState } from "react"

export function DigitalClock() {


    const [currentTime, setTime] = useState("")

    setInterval(() => {
        let clock = new Date()
        let hh = clock.getHours();
        let mm = clock.getMinutes();
        let ss = clock.getSeconds();
        setTime(hh + ":" + mm + ":" + ss)
    }, 1000);

    return (
        <>
            <h1> {JSON.stringify(currentTime)} </h1>
        </>
    )
}