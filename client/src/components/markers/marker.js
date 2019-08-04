import React from 'react'

const markerStyle = {
    fontSize: 10,
    fontWeight: 'bold',
    cursor: 'pointer',
  }

const MyMarker = (props) => {
  return (
        <div>
            <div
                style={{
                    ...markerStyle,
                }}
            >
                <img src={props.img} alt="marker" style={{height: "25px", width: "25px"}}></img>
            </div>
        </div>
  )
}
export default MyMarker;