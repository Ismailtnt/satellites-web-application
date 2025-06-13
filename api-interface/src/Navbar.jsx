import React from 'react';
import { Link, NavLink } from 'react-router-dom'; 

const Navbar = () => {
    return (
        <nav className="navbar-container">
            <Link to="/sate" className="navbar-brand">
                Centre Universitaire de Recherche Spaciale 
            </Link>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/satellites" activeClassName="active">
                        Satellites
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;