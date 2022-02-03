import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room, Star} from '@material-ui/icons'
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import axios from 'axios';
import {format} from 'timeago.js';
import Register from './components/register';
import Login from './components/login';

function Map() {

  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [pins, setPins] = useState([])
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 46,
    zoom: 4
  })
 
  useEffect(() => {
    const getPins = async () => {
      try {
         const res = await axios.get("/pins");
         setPins(res.data)
      } catch (e) {
        console.log(e);
      }
    };
    getPins()
  }, [])

  const handleMarker = (id, lat, long) => {
       setCurrentPlaceId(id)
       setViewport({...viewport, 
        latitude:lat,
      longitude:long})
  }

  const handleAddClick = (e) => {
       const [long, lat] = e.lngLat;
       setNewPlace({
         lat,
         long
       })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      latitude: newPlace.lat,
      longitude: newPlace.long
    }

    try {
       const res = await axios.post("/pins", newPin)
       setPins([...pins, res.data])
       setNewPlace(null)
    } catch (e) {
      console.log(e)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user")
    setCurrentUser(null)
  }

  return (
    <div>
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle='mapbox://styles/jashan-10/ckz27iutv006v14ltinmznf5q'
      onDblClick={handleAddClick}
      transitionDuration="400"
    >

    {
      pins.map((p) => (
    <>    
     <Marker  
     longitude={p.longitude} 
     latitude={p.latitude}
     offsetLeft={-viewport.zoom * 3.5}
     offsetTop={-viewport.zoom * 7}
     >
       <Room style={{fontSize:viewport.zoom * 7, color: p.username === currentUser ? 'tomato' : 'slateblue', cursor: 'pointer'}}
       onClick={() => handleMarker(p._id, p.latitude, p.longitude)}
       />
      </Marker>
      {p._id === currentPlaceId && (
       <Popup
          latitude={p.latitude}
          longitude={p.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}
          anchor="left" >
          <div className='card'>
            <label>Place</label>
            <h4 className='place'>{p.title}</h4>
            <label>Review</label>
            <p className='desc'>{p.desc}</p>
            <label>Rating</label>
            <div className='stars'>
            { Array(p.rating).fill(<Star/>)}
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{p.username}</b></span>
            <span className='date'>{format(p.createdAt)}</span>
          </div>
       </Popup>
      )}
      {currentUser ? (<button onClick={handleLogout} className="button logout">Log Out</button>) : 
      (
        <div>
        <button onClick={() => setShowLogin(true)} className="button login">Log In</button>
        <button onClick={() => setShowRegister(true)} className="button register">Register</button>
        </div>)}

      </>
      ))
    }
    {
      newPlace && (
        <Popup 
        latitude={newPlace.lat}
        longitude={newPlace.long}
        closeButton={true}
        closeOnClick={false}
        anchor='left'
        onClose={() => setNewPlace(null)}
        >
          <div>
             <form onSubmit={handleSubmit}>
               <label>Title</label>
               <input type="text" placeholder='Enter a title.'
               onChange={(e) => setTitle(e.target.value)}
               />
               <label>Review</label>
               <textarea placeholder='Write something about this place.'
               onChange={(e) => setDesc(e.target.value)}/>
               <label>Rating</label>
               <select onChange={(e) => setRating(e.target.value)}>
                 <option value="1">1</option>
                 <option value="2">2</option>
                 <option value="3">3</option>
                 <option value="4">4</option>
                 <option value="5">5</option>
               </select>
               <button className='submitButton' type='submit'>Add Pin</button>
             </form>
            </div>
        </Popup>
      )
    }
    {showRegister && <Register setShowRegister={setShowRegister}/>}
    {showLogin && <Login 
    myStorage={myStorage} 
    setShowLogin={setShowLogin}
    setCurrentUser={setCurrentUser}
    />}
    </ReactMapGL>
    </div>
  );
}

export default Map;
