import React,{useEffect, useState} from 'react'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import RequestsTable from '../Request/RequestsTable';
export default function Homepage(props) {

  const [requestsList, setRequestsList] = useState([]);
  const user = props.user;
  
    const updateTable = () => {
      // debugger
      const token = localStorage.getItem('token')
      let url = ''; 
      if(user && user.role === 'Employee'){
        url = 'http://localhost:3306/request/employee';
      }else if(user &&user.role === 'Manager'){
        url = 'http://localhost:3306/request'
      }
      if(url){
        axios.get(url, {headers: {Authorization: token}})
        .then(res =>{
          setRequestsList(res.data);
          console.log('res.data',res.data)
        })
      }
    }

  useEffect(() => {
    updateTable()
  },[user])

  return (
    <div className='page-content'>
      {(user.role &&user.role) === 'Employee' &&
       (
         <div className='container'>
         <h1 className='u-margin-bottom-small'>Your Requests</h1>
          <div className="requests-list">
            {requestsList.length > 0 ? (
          <RequestsTable updateTable={updateTable} requests={requestsList} role={user.role}/>) : (<h2>You don't make any requests yet</h2>)}     
          </div>
        </div>)}
      
        {(user.role &&user.role) === 'Manager' &&
        (
          <div className='container'>
            <h1 className='u-margin-bottom-small'>All Requests</h1>
            <div className="requests-list">
            {requestsList.length > 0 ? 
            (<RequestsTable requests={requestsList} role={user.role}/>): (<h3 className='u-margin-top-medium'>You don't have any requests</h3>)}     
          </div>
          </div>
        )
        }
      
    </div>
  )
}
