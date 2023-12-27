import { NavLink } from "react-router-dom";
import '../assets/css/cmps/app-header.css';

export function AppHeader() {
    return (
        <header className="app-header">
            <section className="container">
                <h1>Green Mail</h1>
                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/aboutUs">About</NavLink>
                    <NavLink to="/email">Email</NavLink>
                </nav>
            </section>
        </header>
    )
}
