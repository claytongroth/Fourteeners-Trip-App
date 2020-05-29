import React, {Fragment} from 'react';
import { NavLink } from 'react-router-dom';
import Signout from './auth/Signout';

const NavBar = ({ session }) => (
    <nav>
        {session && session.getCurrentUser ? <NavBarAuth session={session}/> : <NavBarUnAuth/>}
    </nav>
);

const NavBarAuth = ({session}) => (
    <Fragment>
        <ul>
            <li>
                <NavLink to="/" exact>Home</NavLink>
            </li>
            <li>
                <NavLink to="/search">Search</NavLink>
            </li>
            <li>
                <NavLink to="/map">Map</NavLink>
            </li>
            <li>
                <NavLink to="/trip/add" >Add Trip Report</NavLink>
            </li>
            <li>
                <NavLink to="/profile" >Profile</NavLink>
            </li>
            <li>
                <Signout/>
            </li>
        </ul>
        <h4><strong>Welcome, {session.getCurrentUser.username}</strong></h4>
    </Fragment>
);

const NavBarUnAuth = () => (
    <ul>
        <li>
            <NavLink to="/" exact>Home</NavLink>
        </li>
        <li>
            <NavLink to="/search">Search</NavLink>
        </li>
        <li>
            <NavLink to="/map">Map</NavLink>
        </li>
        <li>
            <NavLink to="/signin" >Signin</NavLink>
        </li>
        <li>
            <NavLink to="/signup" >Signup</NavLink>
        </li>
    </ul>
);
export default NavBar;