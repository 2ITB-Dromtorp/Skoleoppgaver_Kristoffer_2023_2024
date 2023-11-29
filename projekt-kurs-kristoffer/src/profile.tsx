import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

type username = {
    username: string
}

export default function Profile({ username }: username) {

    const navigate = useNavigate();

    return (

        <Popup
            trigger={<div className="Profile flex flex-row-reverse rounded-lg items-center gap-5 shadow bg-white p-2">
                <img src="blank-profile.webp" className="w-12"></img>
                <p className="p-2">{username}</p>
            </div>}
            closeOnDocumentClick
            contentStyle={{ padding: '0px', border: 'none' }}
            arrow={false}
        >
            <div className="flex flex-col p-2 gap-3">

                <button onClick={() => navigate("/")} className="bg-red-400">Logg ut</button>
            </div>
        </Popup>
    )
}