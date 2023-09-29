import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <div className="Box">

                <Link to="/Page1">JokeAPI</Link>
                <Link to="/Page2">CordinateAPI</Link>
            </div>

            <Outlet />
        </>
    )
};

export default Layout;