import { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

type pameldingPopupBuild = {
    title: string,
    time: string,
    shortDescription: string,
    mainDescription: string,
}

export default function CustomPopup({ title, time, shortDescription, mainDescription }: pameldingPopupBuild) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popup trigger={<div className='bg-blue-300 m-5 flex flex-col'>
            <h1 className=''>{title}</h1>
            <h2 className=''>{time}</h2>
            <p className=''>{shortDescription}</p>
        </div>}
            open={isOpen}
            onOpen={() => setIsOpen(!isOpen)}
            modal>
            <div className='min-h-[75vh]'>
                <button onClick={() => setIsOpen(!isOpen)}>close</button>
                <h1 className=''>{title}</h1>
                <p className=''>{mainDescription}</p>
                <h2 className=''>{time}</h2>
            </div>



        </Popup>
    )
}