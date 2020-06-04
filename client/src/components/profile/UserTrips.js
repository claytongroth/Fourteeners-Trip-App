import React from 'react';
import { Query, Mutation } from 'react-apollo';
import {GET_USER_TRIPS, GET_ALL_TRIPS, DELETE_USER_TRIP, GET_CURRENT_USER} from '../../queries';
import { Link } from 'react-router-dom';

const handleDelete = deleteUserTrip => {
    const confirmDelete = window.confirm("Sure you want to delete?");
    if (confirmDelete){
        deleteUserTrip().then(({data})=>{
            console.log(data);
        })
    }
}

const UserTrips = ({username}) =>(
    <Query query={GET_USER_TRIPS} variables={{username}}>
        {({data, loading, error})=>{
            if (loading) return <div>Loading...</div>
            if (error) return <div>Error...</div>
            return (
                <ul>
                    <h3>Your Trip Reports</h3>
                    {!data.getUserTrips.length && <p><strong>You have not added any trips yet!</strong></p>}
                    {data.getUserTrips.map(trip =>
                        <li key ={trip._id}>
                            <Link to={`/trips/${trip._id}`}><p>{trip.name}</p></Link>
                            <p style={{marginBottom: "0"}}>Likes: {trip.likes}</p>
                            <Mutation 
                                mutation={DELETE_USER_TRIP} 
                                variables={{_id: trip.id}}
                                refetchQueries ={()=>[
                                    {query: GET_ALL_TRIPS},
                                    {query: GET_CURRENT_USER}
                                ]}
                                update={(cache,{data: {deleteUserTrip}})=>{
                                    const {getUserTrips} = cache.readQuery({
                                        query: GET_USER_TRIPS,
                                        variables: {username}
                                    })
                                    cache.writeQuery({
                                        query: GET_USER_TRIPS,
                                        variables: {username},
                                        data: {
                                            getUserTrips: getUserTrips.filter(
                                                trip => trip._id !== deleteUserTrip._id
                                            )
                                        }
                                    })
                                }}
                            >
                                {(deleteUserTrip, attrs={}) =>{
                                    return (
                                        <p  
                                            onClick={()=> handleDelete(deleteUserTrip)} 
                                            className="delete-button">{attrs.loading? 'deleting record...': 'X'}
                                        
                                        </p>
                                    )
                                }}
                            </Mutation>
                        </li>
                    )}
                </ul>
            )
        }}
    </Query>
);

 
export default UserTrips;