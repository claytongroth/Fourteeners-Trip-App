import React, { useState, useEffect } from 'react';
import MyMarker from './markers/marker';
import pin from './markers/pin.svg';
import tent from './markers/tent.svg';
import hiking from './markers/hiking.svg';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, Marker, Popup, ZoomControl } from "react-mapbox-gl";
import mapboxgl from 'mapbox-gl';
import {peeks} from '../constants/14ers';
import axios from 'axios';
import {Query} from 'react-apollo';
import {GET_ALL_TRIPS} from '../queries'
import "./popup.css"
import Reticle from './markers/Reticle';

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ"
});

const ReportsMap = () => {
    const [zoom, setZoom] = useState(8);
    const [center, setCenter] = useState({
        latitude: 39.113014,
        longitude: -105.358887
    })
    const [persistentCenter, setPersistentCenter] = useState([-105.358887,39.113014])
    const [weather, setWeather] = useState(null)
    const [map, setMap] = useState(null);
    const [tripPopup, setTripPopup] = useState(null);

    useEffect(() => {
        getWeather();
    }, [center])

    const onMapLoad = (map) => {
        setMap(map)
        map.setCenter([-105.358887,39.113014])
        map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    }

    const getWeather = () => {
        axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${center.latitude}&lon=${center.longitude}&APPID=71a5463297f3db0c79aa68783a62506d`)
        .then(res => {
            const weather = res.data;
            setWeather(weather)
        })
    }
   
    const _updateViewport = viewport => {
        console.log({viewport})
        //setCenter({viewport});
    };

    const dragEnd = (map) => {
        //console.log([map.getCenter().lng, map.getCenter().lat])
        setCenter({latitude: map.getCenter().lat, longitude :map.getCenter().lng})
    }

    const moveEnd = (map) => {
        //console.log([map.getCenter().lng, map.getCenter().lat])
        setCenter({latitude: map.getCenter().lat, longitude :map.getCenter().lng})
    }

    const _onZoomEnd = (map) => {
        setZoom(map.getZoom())
    }

    const _onRightClick = (map, evt) => {
    }

    const tripPopUpHandler = (x) => {
        setTripPopup({...x})
    }

    return ( 
        <Query query={GET_ALL_TRIPS}>
            {({data, loading, error})=> {
                if (loading) return <div>Loading...</div>
                if (error) return <div>Error!</div>
                return (
                <div className = "App">
                <div className="row">
                    <div className="four columns" > 
                        <h4 >Weather</h4>
                        { weather &&
                            <ul style={{marginRight: 10}}>
                                <li><p><strong>Area:</strong> { weather.name }</p></li>
                                <li><p><strong>Weather:</strong> { weather.weather[0].main }</p></li>
                                <li><p><strong>Temperature:</strong> { weather.main.temp }</p></li>
                                <li><p><strong>Wind Speed:</strong> { weather.wind.speed } MPH</p></li>
                            </ul>
                        }
                        <button 
                            onClick={()=>console.log("clear function here later")} 
                            className="button-primary"
                        >Clear Map</button>

                    </div>
                    <div className="eight columns"> 
                        <Map
                            onViewportChange={_updateViewport}
                            onStyleLoad={ el => {onMapLoad(el)} }
                            onDragEnd={dragEnd}
                            onMoveEnd={moveEnd}
                            onZoomEnd={_onZoomEnd}
                            onContextMenu={_onRightClick}
                            zoom={[zoom]}
                            center={persistentCenter}
                            style = "mapbox://styles/mapbox/streets-v9"
                            containerStyle={{
                                height: "80vh",
                                width: "60vw",
                                marginLeft: 10
                            }}
                        >   
                        {/* <ZoomControl style={{ top: "15%" }} /> */}

                        <Reticle/>
                            {
                                data.getAllTrips.map(x =>
                                <Marker onClick={()=>tripPopUpHandler(x)} coordinates={[x.lon, x.lat]} key={x._id}>
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
                                    <div style={{width: 300}}>                    
                                        <div className="row"> 
                                            <div className="three columns" style={{textAlign: "center"}}>
                                                <img style={{height: 50, width: 50, borderRadius: 25}} src="images/rocky-mountains.svg" alt="mountain"/> 
                                            </div>
                                            <div className="nine columns">
                                                <h4 className="main-header">{tripPopup.name}</h4>
                                            </div>
                                        </div>
                                        <button 
                                            style={{position: "absolute", top: 5, padding: 0, right: 5, width: 25, height: 20, lineHeight: 1.5}} 
                                            className="delete-button" onClick={()=>setTripPopup(null)}
                                        >
                                        X</button>
                                        
                                        <div className="popup-header">Description:</div>
                                            <div className="pop-text">{tripPopup.description}</div>
                                        <div className="popup-header">Category: </div>
                                            <div className="pop-text">{tripPopup.category}</div>
                                        <div className="popup-header">Trip Report: </div>
                                            <div className="pop-text">{tripPopup.instructions}</div>
                                        <div className="popup-header">Added By: </div>
                                            <div className="pop-text">{tripPopup.username}</div>
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
            
    );
}
 
export default ReportsMap;