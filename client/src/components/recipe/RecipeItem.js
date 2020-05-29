import React from 'react';
import {Link} from 'react-router-dom';

const TripItem = ({_id, name, category}) => (
    <li key={_id}>
        <Link to={`/trips/${_id}`}><h4>{name}</h4></Link>
        <p><strong>{category}</strong></p>
    </li>
);


export default TripItem;