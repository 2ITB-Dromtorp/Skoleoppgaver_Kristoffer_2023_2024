import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate()

    const host = () => {
        navigate("/host")
    }

    const join = () => {
        navigate("/join")
    }

    return (
        <div>
            <button onClick={host}>Host</button>
            <button onClick={join}>Join</button>
        </div>
    );
};

export default Home;
