import { useEffect, useState } from "react";
import { Navigate, useLocation } from 'react-router-dom';

import Kurs from "./Popup";

export default function Page() {

    const location = useLocation()
    const username = location.state;

    const [courseList, setCourceList] = useState<any[]>([])
    const [UserList, setUserList] = useState<any[]>([])

    useEffect(() => {
        async function getKursData() {
            fetch("http://localhost:3000/getKurs")
                .then(response => response.json())
                .then(data => setCourceList(data));
        }
        async function getUserData() {
            fetch("http://localhost:3000/getBrukere")
                .then(response => response.json())
                .then(data => {
                    setUserList(data)
                });
        }
        getKursData()
        getUserData()
    }, [username])

    let userIndex: string

    if (UserList.length > 0) {
        for (let i in UserList) {
            if (UserList[i].username.toLowerCase() == username.toLowerCase()) {
                userIndex = i;
            }
        }
    }

    return (
        <div className="Container flex flex-col h-screen">

            <div className="Header w-full bg-gray-200 flex justify-between p-5 items-center shadow-md transition-all duration-150 ease-linear ">

                <img src="Viken_våpen.svg.png" className="w-12" alt="Logo"></img>

                <div className="Profile flex flex-row-reverse items-center gap-5 bg-gray-300 p-2">
                    <img src="blank-profile.webp" className="w-12"></img>
                    <p className="p-2">{username}</p>
                </div>

            </div>

            <div className="Main flex h-screen  justify-center flex-row-reverse gap-16 m-10 ">

                <div className="flex flex-col flex-grow gap-3 items-center">
                    <h1 className="text-center bg-gray-300 p-3 w-[30%] rounded-3xl">Tilgjenlig Kurs</h1>
                    <div className="shadow-md Tilgjenlig-Kurs bg-gray-300 grow rounded-3xl grid grid-cols-2">
                        {courseList.length > 0 && courseList.map((data: any) => {

                            if (UserList.length > 0) {

                                if (!UserList[Number(userIndex)].Kurs.includes(data.Navn) && UserList[Number(userIndex)].username == username) {
                                    return <Kurs key={data.Navn} title={data.Navn} time={data.Tid} shortDescription={data.KortBeskrivelse} mainDescription={data.LangBeskrivelse} attented={data.Påmeldt} location={data.Sted} isAttended={false} oldCourseList={UserList[Number(userIndex)].Kurs} username={username} />
                                }

                            } else {
                                return <p>dosen't work</p>
                            }
                        })}

                    </div>
                </div>

                <div className="flex flex-col flex-grow gap-3 items-center">
                    <h1 className="text-center bg-gray-300 p-3 w-[50%] rounded-3xl">Påmeldt Kurs</h1>
                    <div className="shadow-md Påmeldt-Kurs h-full bg-gray-300  rounded-3xl overflow-auto ">

                        {courseList.length > 0 && courseList.map((data: any) => {

                            if (UserList.length > 0) {

                                for (let i: number = 0; i < UserList.length; i++) {
                                    if (UserList[i].Kurs.includes(data.Navn) && UserList[i].username == username) {
                                        return <Kurs key={data.Navn} title={data.Navn} time={data.Tid} shortDescription={data.KortBeskrivelse} mainDescription={data.LangBeskrivelse} attented={data.Påmeldt} location={data.Sted} isAttended={true} oldCourseList={UserList[Number(userIndex)].Kurs} username={username} />
                                    }
                                }

                            } else {
                                return <p>dosen't work</p>
                            }

                        })}

                    </div>
                </div>


            </div>

        </div>
    )
}