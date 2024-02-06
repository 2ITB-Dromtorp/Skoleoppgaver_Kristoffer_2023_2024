import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const Board = () => {
    const { Player } = useParams();

    useEffect(() => {

        axios.get("/" + Player + "/Roll").then((response) => {

        });

    }, [])

    return (
        <></>
    );
};

export default Board;
