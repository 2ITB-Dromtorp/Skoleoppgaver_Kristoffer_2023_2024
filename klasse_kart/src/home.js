import './App.css';
import Elev from './Elev';

export default function Home() {

    return (

        <div className="container">

            <div className='leftside'>

                <div className='box'>

                    <div className='sitteplasser'>
                        <Elev name="Andreas" />
                        <Elev name="Ahmad" />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name="Philip" />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name="Gabriel" />
                        <Elev name="Theodor" />
                    </div>

                </div>
            </div>


            <div className='rightside'>

                <div className='box'>

                    <div className='sitteplasser'>
                        <Elev name="Mattis" />
                        <Elev name="Alva" />
                        <Elev name="Silas" />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name="Axel" />
                        <Elev name="Vetle" />
                        <Elev name="Kristoffer" />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name="Johannes" />
                        <Elev name="Elias" />
                        <Elev name="Matheo" />
                    </div>

                </div>

            </div>


        </div>
    )
}