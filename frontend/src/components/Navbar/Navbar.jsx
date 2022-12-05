import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom'

export default function Navbar(props) {
  return (
    <div>
        <div className='navbar'>
          <div className="navbar__container">
          {props.user.role === "Manager" ? 
          (<div>
              <li className='navbar-li'>
                <Link className="navbar-href" to='/'><img src="https://www.shura.bh/Style%20Library/Images/ShuraArabicLogo.png" alt="logo"/></Link>
              </li>
              <li className='navbar-li'>
                <Link className="navbar-href" to='/'>Requests</Link>
              </li>
            </div>) :
             (
              <div>
                <Link className="navbar-href" to='/'><img src="https://www.shura.bh/Style%20Library/Images/ShuraArabicLogo.png" alt="logo"/></Link>
              </div>
             )}
            <div>
            {props.user.role === "Employee" && 
                <li className='navbar-li'> 
                    <Link className="navbar-href" to='/request/new'>New request</Link>
                </li>}
                {props.isAuth? <li className='navbar-li'>Welcome {props.user.Fname}</li> : null}
                <li className='navbar-li'> 
                    <Link className="navbar-href" href='/login' onClick={props.onLogoutHandler}>Logout</Link>
                </li>
            </div>
          </div>
        </div>
    </div>
  )
}
