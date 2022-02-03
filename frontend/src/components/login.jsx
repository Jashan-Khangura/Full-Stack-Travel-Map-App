import './login.css';
import { Cancel, Room } from '@material-ui/icons';
import { useState, useRef } from 'react';
import axios from 'axios';

export default function Login(props) {
    const [error, setError] = useState(false)
    const nameRef = useRef()
    const passwordRef = useRef()

const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
        username: nameRef.current.value,
        password: passwordRef.current.value
    }

    try { 
       const res = await axios.post("/users/login", user);
       props.myStorage.setItem("user", res.data.username)
       props.setCurrentUser(res.data.username);
       props.setShowLogin(false);
       setError(false);
    } catch (e) {
        setError(true)
    }
}

    return (
        <div className='loginContainer'>
            <div className='logo'>
                <Room/>
                PinExplore
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginButton">Log In</button>
               
                {error && (
                       <span className='error'>Something went wrong!</span>
                )}
            </form>
            <Cancel onClick={() => props.setShowLogin(false)} className='loginCancel'/>
        </div>
    )
}