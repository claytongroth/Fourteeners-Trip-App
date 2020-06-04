import React from 'react';
import './App.css';
import {GET_ALL_TRIPS} from '../queries';
import { Query } from 'react-apollo';
import TripItem from './trip/TripItem';

const App= () => {
  return (
    <div className="App">
      <h1>_Home_</h1>
      <Query query={GET_ALL_TRIPS}>
        {({data, loading, error})=> {
          if (loading) return <div>Loading...</div>
          if (error) return <div>Error!</div>
          console.log(data)
          return (
            <ul>{data.getAllTrips.map(trip => 
              <TripItem key={trip._id} {...trip}/>
            )}
            </ul>
          )
        }}
      </Query>
    </div>
  );
}

export default App;
