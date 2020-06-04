import React from 'react';
import { Mutation } from 'react-apollo';
import { ADD_TRIP, GET_ALL_TRIPS, GET_USER_TRIPS } from '../../queries';
import Error from '../error';
import { withRouter } from 'react-router-dom';
import withAuth from '../WithAuth';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer} from "react-mapbox-gl";
import {peeks} from '../../constants/14ers';

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ"
});
const zoom = 8;

const initialState = {
    name: '',
    instructions:'',
    category:'Easy',
    description:'',
    username: '',
    lat: 39.113014,
    lon: -105.358887
}

class AddTrip extends React.Component {
    state = {...initialState};
    clearState = () =>{
        this.setState({...initialState});
    }
    componentDidMount(){
        this.setState({
            username: this.props.session.getCurrentUser.username
        })

    }
    // this nicely destructures any field that is changed and dynimcally changes that part of state!
    handleChange = (e) =>{
        e.preventDefault();
        const {name} = e.target;
        let value = e.target.value;
        if (name === "lat" || name === "lon"){
            value = parseFloat(value)
        }  
        console.log(name, value)
        this.setState({
            [name]: value
        });

    }
    // it is an arrow function in the JSX so that it doesn't execute on page load
    handleSubmit = (e, addTrip) => {
        e.preventDefault();
        addTrip().then(({data})=>{
            console.log(data);
        })
        this.clearState();
        this.props.history.push('/');
    }
    validateForm = () => {
        const { name, category, description, instructions} = this.state;
        const isInvalid = !name || !category || !description || !instructions;
        return isInvalid;
    }
    updateCache = (cache, {data:{addTrip} }) => {
        const {getAllTrips} = cache.readQuery({query: GET_ALL_TRIPS});
        cache.writeQuery({
            query: GET_ALL_TRIPS,
            data: {
                getAllTrips: [addTrip, ...getAllTrips]
            }

        });
    }
    _onMarkerDragEnd = event => {
        const {lat, lng} = event.lngLat;
        this.setState({lat, lon: lng});
    };
   render(){
       const { name, category, description, instructions, username, lat, lon} = this.state;
        return(
            <Mutation 
                mutation={ADD_TRIP} 
                variables={{name, category, description, instructions, username, lat, lon}}
                update={this.updateCache}
                refetchQueries={()=>[
                    {query: GET_USER_TRIPS, variables: {username}}
                ]}
            >
                {(addTrip, {data, loading, error})=>{
                    return(
                        <div className="App">
                            <div className="row">
                                <div className="five columns">
                                    <h2 className="App"> Add Trip Report</h2>
                                    <form className="form" onSubmit={(e)=>this.handleSubmit(e, addTrip)}>
                                        <input value={name} type="text" name="name" onChange={this.handleChange} placeholder = "Trip Name/Title"></input>
                                        <select value={category} name="category" onChange={this.handleChange}>
                                            <option value="Easy">Easy</option>
                                            <option value="Tougher">Tougher</option>
                                            <option value="Very Difficult">Very Difficult</option>
                                            <option value="Experts Only">Experts Only</option>
                                        </select>
                                        <input value={description} type="text" name="description" onChange={this.handleChange} placeholder = "Trip Description"></input>
                                        <input value={lat} type="text" name="lat" onChange={this.handleChange} placeholder = "Latitude"></input>
                                        <input value={lon} type="text" name="lon" onChange={this.handleChange} placeholder = "Longitude"></input>
                                        <textarea value={instructions} name="instructions" onChange={this.handleChange} placeholder = "Trip Details"></textarea>
                                        <button disabled={loading || this.validateForm()} type="submit" className="button-primary">Submit</button>
                                        {error && <Error error={error}/>}
                                    </form>
                                    </div>
                                <div className="five columns">
                                    <Map
                                        center={[lon, lat]} 
                                        zoom={[zoom]}
                                        style= "mapbox://styles/mapbox/streets-v9"
                                        containerStyle={{
                                            height: "400px",
                                            width: "50vw"
                                        }}
                                    >
                                        <Layer 
                                            type="circle" 
                                            id="marker" 
                                            paint={{
                                                'circle-radius': 10,
                                                'circle-color': "#8B0000",
                                                'circle-stroke-width': 3,
                                                'circle-stroke-color': '#8B0000',
                                                'circle-stroke-opacity': .7
                                            }}
                                        >
                                            <Feature
                                                draggable = {true}
                                                onDragEnd={this._onMarkerDragEnd}
                                                coordinates={[lon, lat] }
                                            >
                                            </Feature>
                                        </Layer>
                                        <GeoJSONLayer
                                            symbolLayout={{
                                                "icon-image": "mountain-15",
                                                "icon-size": 1.5,
                                                "text-size": 10,
                                                "text-field": "{mountain}\n{altitude}",
                                                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                                                "text-offset": [0, 0.6],
                                                "text-anchor": "top"
                                            }}
                                            data={peeks}
                                        />
                                    </Map>
                                </div>
                        </div>
                        </div>
                    )
                }}
            </Mutation>
        )
    }
};

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddTrip));