import { useState } from 'react';
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
        fetch(encodeURI("/getBrukere?kurs=" + oldCourse.replace(course, " ")), {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })
    } else {
        fetch(encodeURI("/getBrukere?kurs=" + (oldCourse + " " + course)), {
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
        <Popup trigger={
            <div className={isAttended ? "bg-blue-300 shadow-xl rounded-lg m-5 gap-5" : 'bg-blue-300 shadow-xl h-max  rounded-3xl m-3 '}>
                <div className={isAttended ? 'flex flex-row' : 'flex flex-col gap-2'}>
                    <h1 className={isAttended ? "bg-gradient-to-r from-sky-500 to-blue-300 text-center rounded-l-lg p-2 w-full mr-2" : 'bg-gradient-to-b from-sky-500 to-blue-300 text-center  rounded-t-3xl p-4'}  >{title}</h1>
                    <h2 className={isAttended ? "text-center" : 'text-center p-1'}>{time}</h2>
                    <p className={isAttended ? "hidden" : 'text-center p-1'}>{shortDescription}</p>
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
                            <p >{time} {location}</p>
                        </div>

                    </div>

                    {isAttended ? <button className='bg-red-500 p-2 rounded-xl m-6 mt-0' onClick={() => attendCourse(isAttended, oldCourseList, title, username)}> Avmeld </button> : <button className='bg-green-400 p-2 rounded-xl m-6 mt-0' onClick={() => attendCourse(isAttended, oldCourseList, title, username)}> Påmeld </button>}

                </div>

            </div>





        </Popup>
    )
}