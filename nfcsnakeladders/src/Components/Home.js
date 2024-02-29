import { useNavigate } from "react-router-dom";
import logo from "../Assets/gameLogo.png"

const Home = () => {

    const navigate = useNavigate()

    const host = () => {
        navigate("/host")
    }

    const join = () => {
        navigate("/join")
    }

    return (
        <div className="Home">
            <img style={{ width: "70%" }} alt="logo" src={logo}></img>
            <div className="HomeButtons">
                <button className="HomeButtonStyle" onClick={host}>Host</button>
                <button className="HomeButtonStyle" onClick={join}>Join</button>
            </div>

        </div>
    );
};

export default Home;
