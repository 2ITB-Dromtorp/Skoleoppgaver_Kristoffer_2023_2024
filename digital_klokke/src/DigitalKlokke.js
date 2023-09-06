import { useState, useEffect } from "react"

export function DigitalClock() {


    const [currentTime, setTime] = useState("")

    useEffect(() => {
        const clockUpdate = setInterval(() => {
            let clock = new Date()
            setTime(clock.getHours() + ":" + clock.getMinutes() + ":" + clock.getSeconds())
        }, 500);

        return () => clearInterval(clockUpdate)
    })




    return (
        <>
            <h1> {JSON.stringify(currentTime)} </h1>
        </>
    )
}