import './register.css';
import { Cancel, Room } from '@material-ui/icons';
import { useState, useRef } from 'react';
import axios from 'axios';

export default function Register(props) {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
        username: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value
    }

    try { 
       const res = await axios.post("/users/register", newUser);
       setError(false)
       setSuccess(true)
    } catch (e) {
        setError(true)
        setSuccess(false)
    }
}

    return (
        <div className='registerContainer'>
            <div className='logoRegister'>
                <Room/>
                PinExplore
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="email" placeholder='email' ref={emailRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="registerButton">Register</button>
               
                {success && (
                       <span className='success'>You've registered successfully.</span>
                )}
                {error && (
                       <span className='error'>Unable to register user.</span>
                )}
            </form>
            <Cancel onClick={() => props.setShowRegister(false)} className='registerCancel'/>
        </div>
    )
}