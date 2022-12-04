import React, {useState} from 'react'
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
// import './Login.css'
export default function Login(props) {

  const [newUser, setNewUser] = useState({});

    const changeHandler = (e) => {
        const user = { ...newUser };
        user[e.target.name] = e.target.value;
        console.log(user);
        setNewUser(user);
    }

    const loginHandler = (e) => {
        try{
            e.preventDefault() 
            props.login(newUser)
        }catch(err){
            console.log(err)
        }  
    }


  return (
    <div className="login">    
      <div className="login__card">
        <h1 className='u-margin-bottom-medium'>Login to continue</h1>

          <div className="form-floating mb-3">
            <input type="email" name="email" onChange={changeHandler} className="form-control" id="floatingInput" placeholder="name@example.com"/>
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" name="Password" onChange={changeHandler} className="form-control" id="floatingPassword" placeholder="Password" required/>
            <label htmlFor="floatingPassword">Password</label>
          </div>
        
        <button type='submit' className="button button--red u-margin-top-medium" onClick={loginHandler}>Login</button>
      </div>
    </div>
  );
}