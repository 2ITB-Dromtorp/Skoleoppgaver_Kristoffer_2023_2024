import './App.css';
import Elev from './Elev';
const elever = require('./elever.json');

let randomizedElevArray = []

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


export function RenderClass() {

    let elev = JSON.parse(JSON.stringify(elever))
    for (let elevnavn of elev) {
        randomizedElevArray.push(elevnavn.Fornavn)
    }
    shuffleArray(randomizedElevArray)

    return (
        <>
            <div className='leftside'>

                <div className='box' id="box1">

                    <div className='sitteplasser'>
                        <Elev name={randomizedElevArray[0]} />
                        <Elev name={randomizedElevArray[1]} />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name={randomizedElevArray[2]} />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name={randomizedElevArray[3]} />
                        <Elev name={randomizedElevArray[4]} />
                    </div>

                </div>
            </div>


            <div className='rightside'>

                <div className='box' id="box2">

                    <div className='sitteplasser'>
                        <Elev name={randomizedElevArray[5]} />
                        <Elev name={randomizedElevArray[6]} />
                        <Elev name={randomizedElevArray[7]} />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name={randomizedElevArray[8]} />
                        <Elev name={randomizedElevArray[9]} />
                        <Elev name={randomizedElevArray[10]} />
                    </div>

                    <div className='sitteplasser'>
                        <Elev name={randomizedElevArray[11]} />
                        <Elev name={randomizedElevArray[12]} />
                        <Elev name={randomizedElevArray[13]} />
                    </div>
                </div>

            </div>

        </>
    )
}

export default function Home() {

    return (
        <>
            <button id="Goofy" onClick={() => window.location.reload()}>Randomize</button>
            <div className="container">

                <RenderClass />

            </div>
        </>
    )
}