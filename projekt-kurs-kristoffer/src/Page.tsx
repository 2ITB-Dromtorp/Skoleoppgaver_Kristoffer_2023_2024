import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

import Kurs from "./popup";
import Profile from "./profile";

export default function Page() {

    const location = useLocation()
    const username = location.state;

    const [courseList, setCourceList] = useState<any[]>([])
    const [UserList, setUserList] = useState<any[]>([])

    useEffect(() => {
        async function getKursData() {
            fetch("/getKurs", { method: "get" })
                .then(response => response.json())
                .then(data => setCourceList(data));
        }
        async function getUserData() {
            fetch("/getBrukere", { method: "get" })
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
        <div className="Container flex flex-col h-screen bg-gradient-to-r from-cyan-500 to-blue-500">

            <div className="Header w-full bg-white flex justify-between p-5 items-center shadow-2xl transition-all duration-150 ease-linear ">

                <a href="/page">
                    <img src="Viken_våpen.svg.png" className="w-12" alt="Logo"></img>
                </a>

                <Profile username={username} />

            </div>

            <div className="Main  flex h-screen  justify-center flex-row-reverse gap-16 m-10 ">

                <div className="flex flex-col  w-[80%] gap-3 items-center">
                    <h1 className="text-center shadow-inner font-bold  bg-gray-100 p-3 w-[30%] rounded-3xl">Tilgjenlig Kurs</h1>
                    <div className="shadow-2xl Tilgjenlig-Kurs bg-gray-100 min-h-[90%] min-w-full rounded-3xl grid grid-cols-4">
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

                <div className="flex flex-col w-[35%] flex-grow gap-3 items-center min-h-full">
                    <h1 className="text-center bg-gray-100 shadow-inner  font-bold p-3 w-[80%] rounded-3xl">Påmeldt Kurs</h1>
                    <div className="shadow-md Påmeldt-Kurs min-h-[90%]  min-w-full bg-gray-100  rounded-3xl overflow-auto ">

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