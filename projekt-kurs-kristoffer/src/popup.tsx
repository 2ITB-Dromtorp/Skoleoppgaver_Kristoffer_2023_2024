import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

type pameldingPopupBuild = {
    title: string,
    time: string,
    shortDescription: string,
    mainDescription: string,
    location: string,
    attented: number,
    isAttended: boolean,
    oldCourseList: string,
    username: string
}

async function attendCourse(isAttended: boolean, oldCourse: string, course: string) {

    if (isAttended) {
        fetch(encodeURI("http://localhost:3000/getBrukere?kurs=" + oldCourse.replace(course, " ")), {
            method: "POST",

        })
    } else {
        fetch(encodeURI("http://localhost:3000/getBrukere?kurs=" + (oldCourse + " " + course)), {
            method: "POST",
        })

    }

    window.location.reload();
}

export default function Kurs({ title, time, shortDescription, mainDescription, location, isAttended, oldCourseList }: pameldingPopupBuild) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popup trigger={<div className={isAttended ? "bg-blue-300 rounded-3xl m-5 flex flex-col gap-5" : 'bg-blue-300 rounded-3xl m-5 flex flex-col gap-5'}>
            <h1 className='bg-blue-400 text-center rounded-t-3xl p-5'>{title}</h1>
            <h2 className='text-center'>{time}</h2>
            <p className='text-center'>{shortDescription}</p>
        </ div>}
            open={isOpen}
            onOpen={() => setIsOpen(!isOpen)}
            modal>
            <div className='min-h-[75vh]'>
                <button onClick={() => setIsOpen(!isOpen)}>close</button>
                <h1 className=''>{title}</h1>
                <p className=''>{mainDescription}</p>
                <h2 className=''>{time} {location}</h2>
                {isAttended ? <button onClick={() => attendCourse(isAttended, oldCourseList, title)}> Avmeld </button> : <button onClick={() => attendCourse(isAttended, oldCourseList, title)}> Påmeld </button>}

            </div>



        </Popup>
    )
}