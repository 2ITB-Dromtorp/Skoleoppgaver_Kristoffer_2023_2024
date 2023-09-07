import { useState, useEffect } from "react"
import ConfettiExplosion from 'react-confetti-explosion';

export function DigitalClock() {

    const [currentTime, setTime] = useState("")
    const [isExploding, setIsExploding] = useState(false);

    useEffect(() => {
        setIsExploding(true)
        const clockUpdate = setInterval(() => {
            let clock = new Date()
            setTime(clock.getHours() + ":" + clock.getMinutes() + ":" + clock.getSeconds())
            setIsExploding(false)
        }, 1000);
        return () => clearInterval(clockUpdate)
    })

    return (
        <>
            <h1> {JSON.stringify(currentTime)}   </h1>
            {isExploding && <ConfettiExplosion
                particleSize={10}
                force={1}
            />}
        </>
    )
}