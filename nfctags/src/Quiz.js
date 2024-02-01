import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const Quiz = () => {
    const [Quiz, setQuiz] = useState({
        spørsmål: "",
        svaralternativer: []
    })
    const { Tema, Page } = useParams();

    useEffect(() => {

        axios.get("/getQuiz/" + Tema + "/" + Page).then((response) => {
            setQuiz({ spørsmål: response.spørsmål, svaralternativer: response.svaralternativer });
        });

    }, [])

    return (
        <>{Quiz}<p>{Tema}{Page}</p></>
    );
};

export default Quiz;
