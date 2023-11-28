import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
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

async function attendCourse(isAttended: boolean, oldCourse: string, course: string, username: string) {

    if (isAttended) {
        fetch(encodeURI("http://localhost:3000/getBrukere?kurs=" + oldCourse.replace(course, " ")), {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })
    } else {
        fetch(encodeURI("http://localhost:3000/getBrukere?kurs=" + (oldCourse + " " + course)), {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })

    }

    window.location.reload()
}

export default function Kurs({ title, time, shortDescription, mainDescription, location, isAttended, oldCourseList, username }: pameldingPopupBuild) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popup trigger={<div className={isAttended ? "bg-blue-300 shadow-md w-64 rounded-3xl m-5 flex flex-col gap-5" : 'bg-blue-300 shadow-md rounded-3xl  m-5 flex flex-col gap-5'}>
            <div>
                <h1 className='bg-blue-400 text-center rounded-t-3xl p-3s'>{title}</h1>
                <h2 className='text-center'>{time}</h2>
                <p className='text-center p-3'>{shortDescription}</p>
            </div>

        </ div>}
            open={isOpen}
            onOpen={() => setIsOpen(!isOpen)}
            modal>
            <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-40">
                <div className='max-h-full w-full flex flex-col max-w-xl justify-center overflow-y-auto sm:rounded-2xl bg-white hover:shadow-lg transition-all duration-150 ease-linear'>


                    <div className='flex flex-row-reverse mr-5 '>
                        <button className='bg-red-500 p-1' onClick={() => setIsOpen(!isOpen)}>Close</button>
                    </div>

                    <div className='text-center p-6 pt-0 gap-12'>
                        <h1 className='font-bold'>{title}</h1>
                        <p className=''>{mainDescription}</p>
                        <div className='mt-5'>
                            <p>Sted:</p>
                            <p >{time} {location}</p>
                        </div>

                    </div>

                    {isAttended ? <button className='bg-red-500 p-2 rounded-xl m-6 mt-0' onClick={() => attendCourse(isAttended, oldCourseList, title, username)}> Avmeld </button> : <button className='bg-green-400 p-2 rounded-xl m-6 mt-0' onClick={() => attendCourse(isAttended, oldCourseList, title, username)}> Påmeld </button>}

                </div>

            </div>





        </Popup>
    )
}