import React from 'react';
import {withRouter} from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import LikeRecipe from './LikeRecipe';
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import MyMarker from '../markers/marker';
import pin from '../markers/pin.svg';

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ"
});
const zoom = 8;

const RecipePage = ({match}) => {
    const { _id } = match.params;
    return (
        <Query query={GET_RECIPE} variables={{_id}}>
            {({data, loading, error})=>{
                if(loading) return <div>Loading...</div>
                if (error) return <div>Error</div>
                console.log(data.getRecipe)
                return (
                    <div className="App">
                    <div className="row">
                        <div className="five columns">
                            <h2>{data.getRecipe.name}</h2>
                            <p>Category: {data.getRecipe.category}</p>
                            <p>Description: {data.getRecipe.description}</p>
                            <p>Trip Details: {data.getRecipe.instructions}</p>
                            <p>Likes: {data.getRecipe.likes}</p>
                            <p>Created by: {data.getRecipe.username}</p>
                            <p>Lat,Lon: {data.getRecipe.lat}, {data.getRecipe.lon}</p>
                            <LikeRecipe _id={_id}/>
                        </div>
                        <div className="five columns">
                            <Map
                                center={[data.getRecipe.lon,data.getRecipe.lat]} 
                                zoom={[zoom]}
                                style= "mapbox://styles/mapbox/streets-v9"
                                containerStyle={{
                                    height: "400px",
                                    width: "400px"
                                }}
                            >
                                <Marker coordinates={[data.getRecipe.lon,data.getRecipe.lat]} >
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

export default withRouter(RecipePage);