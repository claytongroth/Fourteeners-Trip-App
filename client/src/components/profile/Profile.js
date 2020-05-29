import React from "react";
import UserInfo from './UserInfo';
import UserTrips from './UserTrips';
import withAuth from '../WithAuth';


const Profile = ({session}) => (
    <div className="App">
        <UserInfo session={session}/>
        <UserTrips username={session.getCurrentUser.username}/>
    </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);