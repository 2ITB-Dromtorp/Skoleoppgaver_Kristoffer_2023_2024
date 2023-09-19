import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>

                    <li>
                        <Link to="/Page1">Page1</Link>
                    </li>
                    <li>
                        <Link to="/Page2">Page2</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;