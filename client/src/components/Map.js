import React from 'react';
import MyMarker from './markers/marker';
import pin from './markers/pin.svg';
import tent from './markers/tent.svg';
import hiking from './markers/hiking.svg';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, Marker, Popup, ZoomControl } from "react-mapbox-gl";
import {peeks} from '../constants/14ers';
import axios from 'axios';
import {Query} from 'react-apollo';
import {GET_ALL_RECIPES} from '../queries'

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ"
});

class MapPage extends React.Component {
    state = {
        zoom: 8,
        marker: {
            latitude: 39.113014,
            longitude: -105.358887
        },
        viewport: {
            latitude: 37.785164,
            longitude: -100,
            zoom: 8,
            bearing: 0,
            pitch: 0
        },
        events:{},
        weather: null,
        campsites: null,
        campPopup: null,
        trails: null,
        trailPopup: null,
        tripPopup: null,
        showCamps: true,
        showTrails: true


    }
    shouldComponentUpdate(prevState, nextState){
       return prevState.campsites !== nextState.campsites || prevState.trails !== nextState.trails;
    }
    componentDidMount() {
        //71a5463297f3db0c79aa68783a62506d
        this.getWeather();
    }
    componentDidUpdate(){

    }
    getWeather = () => {
        axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.state.marker.latitude}&lon=${this.state.marker.longitude}&APPID=71a5463297f3db0c79aa68783a62506d`)
        .then(res => {
            const weather = res.data;
            this.setState({ weather });
        })
    }
    getCampgrounds = () => {
        axios.get(`https://www.hikingproject.com/data/get-campgrounds?lat=${this.state.marker.latitude}&lon=${this.state.marker.longitude}&maxDistance=50&key=106768918-c3adb5c4075e2803170b529f00384e64`)
        .then(res => {
            const campsites = res.data;
            this.setState({ campsites });
        })
    }
    getTrails = () => {
        axios.get(`https://www.hikingproject.com/data/get-trails?lat=${this.state.marker.latitude}&lon=${this.state.marker.longitude}&maxDistance=10&key=106768918-c3adb5c4075e2803170b529f00384e64`)
        .then( res => {
            const trails = res.data;
            this.setState({trails});
        })
    }
    _updateViewport = viewport => {
        this.setState({viewport});
    };
    
    _logDragEvent(name, event) {
        this.setState({
            events: {
            ...this.state.events,
            [name]: event.lngLat
            }
        });
    }
    keepZoom = () => {
        const currentZoom = this.map.getZoom();
        //console.log("CurrentZoom: ", currentZoom)
        this.setState({zoom: currentZoom})
    }
    _onMarkerDragStart = event => {
        this.keepZoom();
        this._logDragEvent('onDragStart', event);
    };
    
    _onMarkerDrag = event => {
        this.keepZoom();
        this._logDragEvent('onDrag', event);
    };
    
    _onMarkerDragEnd = event => {
        this.keepZoom();
        const {lat, lng} = event.lngLat;
        this._logDragEvent('onDragEnd', event);
        this.setState({
            marker: {
            longitude: lng,
            latitude: lat
            }
        }, ()=>this.getWeather());
    };
    campPopUpHandler = (x) =>{
        //console.log(x)
        this.setState({
            campPopup: {
                ...x
            }
        })
    }
    trailPopUpHandler = (x) => {
        //console.log(x)
        this.setState({
            trailPopup: {
                ...x
            }
        })
    }
    tripPopUpHandler = (x) => {
        console.log(x)
        this.setState({
            tripPopup:{
                ...x
            }
        })
    }
    clearPopup = (x) => {
        this.setState({
            campPopup: null,
            trailPopup: null,
            tripPopup: null
        })
    }
    // TODO 

    // 
    // refactor into more modular components
    // Destructure even further
    // fix double zoom?
    // 
    render(){
        const { campsites, weather, trails, marker, viewport, tripPopup, campPopup, trailPopup, showCamps, showTrails, zoom} = this.state;
        return (
            <Query query={GET_ALL_RECIPES}>
            {({data, loading, error})=> {
              if (loading) return <div>Loading...</div>
              if (error) return <div>Error!</div>
              return (
                <div className = "App">
                <div className="row">
                    <div className="four columns" > 
                        <button onClick={()=>this.getTrails()} >View Trail Data</button>
                        <br/>
                        <button onClick={()=>this.getCampgrounds()} >View Campsites</button>
                        <br/>
                        <button onClick={()=>this.getCampgrounds()}>View Trip Reports</button>
                        <br/>
                        <button 
                            onClick={()=>this.setState({trails:null, campsites:null})} 
                            className="button-primary"
                        >Clear Map</button>
                        <h4 >Weather</h4>
                        { weather &&
                            <ul style={{marginRight: 10}}>
                                <li><p><strong>Area:</strong> { weather.name }</p></li>
                                <li><p><strong>Weather:</strong> { weather.weather[0].main }</p></li>
                                <li><p><strong>Temperature:</strong> { weather.main.temp }</p></li>
                                <li><p><strong>Wind Speed:</strong> { weather.wind.speed } MPH</p></li>
                            </ul>
                        }
                        

                    </div>
                    <div className="eight columns"> 
                        <Map
                            onViewportChange={this._updateViewport}
                            onStyleLoad={ el => this.map = el }
                            center={[marker.longitude, marker.latitude]} 
                            zoom={[zoom]}
                            style= "mapbox://styles/mapbox/streets-v9"
                            containerStyle={{
                                height: "80vh",
                                width: "60vw",
                                marginLeft: 10
                            }}
                        >       
                            <div style={{position:"absolute", left: 0, top:0, backgroundColor: "rgba(255, 255, 255, 0.7)"}}>
                                <p style={{fontSize: 14, marginTop: 10, marginBottom: 0, marginRight: 5}}>Drag the blip to set you trip's location!</p>
                                <svg height="30" width="30" style={{left: 50}}>
                                    <circle cx="17.5" cy="17.5" r="10" stroke="#8B0000" strokeWidth="3" fill="#8B0000" />
                                </svg>
                            </div>   
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
                                    coordinates={[marker.longitude, marker.latitude]}
                                    offsetTop={-20}
                                    offsetLeft={-10}
                                    draggable = {true}
                                    onDragStart={this._onMarkerDragStart}
                                    onDrag={this._onMarkerDrag}
                                    onDragEnd={this._onMarkerDragEnd}
                                >
                                </Feature>
                            </Layer>
                            {campsites && 
                                campsites.campgrounds.map(x =>
                                    <Marker onClick={()=>this.campPopUpHandler(x)} coordinates={[x.longitude, x.latitude]} key={x.id}>
                                        <MyMarker img={tent} />
                                    </Marker>
                                )
                            }
                            {campPopup &&
                                <Popup
                                coordinates={[campPopup.longitude,campPopup.latitude]}
                                offset={{
                                'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                                }}>
                                    <div className="row">                    
                                        <h5>{campPopup.name}</h5>
                                        <p>{campPopup.location}</p>
                                        <a  style={{float: "left"}} href={campPopup.url} target="_blank"><button className="button-primary">View Site</button></a>
                                        <button style={{float: "right"}}  className="delete-button" onClick={()=>this.clearPopup()}>X</button>

                                    </div>
                            </Popup>
                            }
                            {trails && 
                                trails.trails.map(x =>
                                <Marker onClick={()=>this.trailPopUpHandler(x)} coordinates={[x.longitude, x.latitude]} key={x.id}>
                                    <MyMarker img={hiking} />
                                </Marker>
                                )
                            }
                            {trailPopup &&
                                <Popup
                                coordinates={[trailPopup.longitude,trailPopup.latitude]}
                                offset={{
                                'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                                }}>
                                    <div className="row">                    
                                        <div className="six columns">
                                            <h5>{trailPopup.name}</h5>
                                            <p>{trailPopup.location}</p>
                                            <ul>
                                                <li><strong>Conditions:</strong> {trailPopup.conditionDetails}</li>
                                                <li><strong>Length:</strong> {trailPopup.length}</li>
                                                <li><strong>Alt. Gained:</strong> {trailPopup.ascent}</li>
                                                <li><strong>Difficulty:</strong> {trailPopup.difficulty}</li>
                                            </ul>
                                        </div>
                                        <div className="six columns">
                                            <img src={trailPopup.imgSmall} alt="No Trail Image"></img>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="six columns">
                                            <a href={trailPopup.url} target="_blank"><button className="button-primary">View Trail</button></a>
                                        </div>
                                        <div className="six columns">
                                            <button style={{right:0}} className="delete-button" onClick={()=>this.clearPopup()}>X</button>
                                        </div>
                                    </div>
                            </Popup>
                            }
                            {
                                data.getAllRecipes.map(x =>
                                <Marker onClick={()=>this.tripPopUpHandler(x)} coordinates={[x.lon, x.lat]} key={x._id}>
                                    <MyMarker img={pin} />
                                </Marker>
                                )
                            }
                            {tripPopup &&
                                <Popup
                                    coordinates={[tripPopup.lon,tripPopup.lat]}
                                    offset={{
                                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                                }}>
                                    <div>                    
                                        <h5>{tripPopup.name}</h5>
                                        <p><strong>Description: </strong>{tripPopup.description}</p>
                                        <p><strong>Category: </strong>{tripPopup.category}</p>
                                        <p><strong>Trip Report: </strong>{tripPopup.instructions}</p>
                                        <p><strong>Added By: </strong>{tripPopup.username}</p>
                                        <button className="delete-button" onClick={()=>this.clearPopup()}>X</button>
                                    </div>
                                </Popup>
                            }
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
          </Query>
            
        )
    }
}

export default MapPage;