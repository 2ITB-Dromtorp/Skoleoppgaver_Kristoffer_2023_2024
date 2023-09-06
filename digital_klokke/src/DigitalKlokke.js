import { useState } from "react"

export function DigitalClock() {


    const [currentTime, setTime] = useState("")

    setInterval(() => {
        let clock = new Date()
        setTime(clock.getHours() + ":" + clock.getMinutes() + ":" + clock.getSeconds())
    }, 1000);

    return (
        <>
            <h1> {JSON.stringify(currentTime)} </h1>
        </>
    )
}