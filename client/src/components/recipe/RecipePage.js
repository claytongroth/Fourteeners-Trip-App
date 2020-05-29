import React from 'react';
import {withRouter} from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_TRIP } from '../../queries';
import LikeTrip from './LikeTrip';
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import MyMarker from '../markers/marker';
import pin from '../markers/pin.svg';

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ"
});
const zoom = 8;

const TripPage = ({match}) => {
    const { _id } = match.params;
    return (
        <Query query={GET_TRIP} variables={{_id}}>
            {({data, loading, error})=>{
                if(loading) return <div>Loading...</div>
                if (error) return <div>Error</div>
                console.log(data.getTrip)
                return (
                    <div className="App">
                    <div className="row">
                        <div className="five columns">
                            <h2>{data.getTrip.name}</h2>
                            <p>Category: {data.getTrip.category}</p>
                            <p>Description: {data.getTrip.description}</p>
                            <p>Trip Details: {data.getTrip.instructions}</p>
                            <p>Likes: {data.getTrip.likes}</p>
                            <p>Created by: {data.getTrip.username}</p>
                            <p>Lat,Lon: {data.getTrip.lat}, {data.getTrip.lon}</p>
                            <LikeTrip _id={_id}/>
                        </div>
                        <div className="five columns">
                            <Map
                                center={[data.getTrip.lon,data.getTrip.lat]} 
                                zoom={[zoom]}
                                style= "mapbox://styles/mapbox/streets-v9"
                                containerStyle={{
                                    height: "400px",
                                    width: "400px"
                                }}
                            >
                                <Marker coordinates={[data.getTrip.lon,data.getTrip.lat]} >
                                    <MyMarker img={pin} />
                                </Marker>
                            </Map>
                            </div>
                    </div>
                    </div>

                    
                );
            }}
        </Query>
    );
}

export default withRouter(TripPage);