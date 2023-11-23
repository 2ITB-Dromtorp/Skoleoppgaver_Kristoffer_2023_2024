
import { useEffect, useState } from "react";
import "./index.css"
import Kurs from "./Popup";


function App() {

  const [courseList, setCourceList] = useState<any[]>([])
  const [courseUserList, setUserCourseList] = useState<any[]>([])
  const [username, setUsername] = useState("Kristoffer Bekkevold")

  useEffect(() => {
    async function getKursData() {
      fetch("http://localhost:3000/getKurs")
        .then(response => response.json())
        .then(data => setCourceList(data));
    }
    async function getUserKursData() {
      fetch("http://localhost:3000/getBrukere")
        .then(response => response.json())
        .then(data => setUserCourseList(data));
    }
    getKursData()
    getUserKursData()
  }, [])

  return (
    <div className="Container flex flex-col h-screen">

      <div className="Header w-full bg-red-100 flex justify-between p-5 items-center">

        <img src="Viken_våpen.svg.png" className="w-12" alt="Logo"></img>

        <div className="Profile flex flex-row-reverse items-center gap-5">
          <img src="blank-profile.webp" className="w-12"></img>
          <p>{username}</p>
        </div>

      </div>

      <div className="Main flex h-screen items-center justify-center flex-row-reverse gap-16 m-10 mt-24">

        <div className="Tilgjenlig-Kurs bg-gray-300 grow min-h-full grid grid-cols-4 rounded-3xl">

          {courseList.length > 0 && courseList.map((data: any) => {

            if (courseUserList.length > 0) {

              for (let i: number = 0; i < courseUserList.length; i++) {
                if (!courseUserList[i].Kurs.includes(data.Navn) && courseUserList[i].username == username) {
                  return <Kurs key={data.Navn} title={data.Navn} time={data.Tid} shortDescription={data.KortBeskrivelse} mainDescription={data.LangBeskrivelse} attented={data.Påmeldt} location={data.Sted} isAttended={false} />
                }
              }

            } else {
              return <p>dosen't work</p>
            }
          })}

        </div>

        <div className="Påmeldt-Kurs bg-gray-300 h-full flex flox-col w-[42vw] row-span-3 rounded-3xl">

          {courseList.length > 0 && courseList.map((data: any) => {

            if (courseUserList.length > 0) {

              for (let i: number = 0; i < courseUserList.length; i++) {
                if (courseUserList[i].Kurs.includes(data.Navn) && courseUserList[i].username == username) {
                  return <Kurs key={data.Navn} title={data.Navn} time={data.Tid} shortDescription={data.KortBeskrivelse} mainDescription={data.LangBeskrivelse} attented={data.Påmeldt} location={data.Sted} isAttended={true} />
                }
              }

            } else {
              return <p>dosen't work</p>
            }

          })}

        </div>

      </div>

    </div>
  )
}

export default App
