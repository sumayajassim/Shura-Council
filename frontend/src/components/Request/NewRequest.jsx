import React,{useEffect, useState} from 'react'
import Calendar from 'react-calendar';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewLeave(props) {
  const [leaveDays, setLeaveDays] = useState(new Date());
  const [range, setRange] = useState({});
  const [validRequest, setValidRequest] = useState(true);
  const navigate = new useNavigate();
  const user = props.user;
  const endDate = moment().add(1, 'Y');

  useEffect(() => {
    if(leaveDays.length > 0 && user.numOfLeaves - leaveDays.length >= 0){
      setValidRequest(false);
    }else{
      setValidRequest(true);
    }
  }, [leaveDays])

  const handleChange = (e) =>{
    setRange(e)
    console.log('New date is: ',  e[0].toUTCString())
    getDatesInRange(e[0], e[1]);
    console.log('eaveDays.length', leaveDays.length)
    console.log('leaveDays.length > 0 && user.numOfLeaves - leaveDays.length > 0',leaveDays.length > 0 && (user.numOfLeaves - leaveDays.length) > 0);
    
    
  }

  const getDatesInRange = (startDate, endDate) => {
    const date = new Date(startDate.getTime());
    console.log('range',range);
  
    const dates = [];
    while (date <= endDate) {
      if(date.getDay() !== 5 && date.getDay() !== 6){
        dates.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
    setLeaveDays(dates)
    return dates;
  }

  const confirmRequest = (e) =>{
    e.preventDefault();
    const token = localStorage.getItem('token')
    const formData = {
      status : 'Pending',
      startDate: moment(range[0]).format('YYYY-MM-DD'),
      endDate: moment(range[1]).format('YYYY-MM-DD'),
      type: 'Leave',
      managerID: user.ManagerID,
      employeeID : user.id,
      numOfDays: leaveDays.length
    }
    axios.post(`http://localhost:3306/request`, formData, {headers: {Authorization: token}})
      .then(res => {
       toast.success('Your request have been sent successfully!')
       navigate('/');
      })
      .catch(err =>{
        // console.log(err.response.data);
        toast.error(err.response.data);
    })
  }

  return (
    <div className='page-content'>
      {user.role === 'Employee' &&
       (<div className='container container--align-content-to-left'>
        <h1 className='u-margin-bottom-small'>New Request</h1>
        <div className='container--grid'>
          <div className="grid-item">
            <Calendar
              onChange={handleChange}
              calendarType={'Hebrew'}
              selectRange={true}
              view={"month"}
              minDate={new Date()}
              maxDate={new Date(endDate)}
              />
          </div>
          <div className='details-container grid-item-'>
              <div className='info-box'>You have &nbsp; <strong>{user.numOfLeaves}</strong> &nbsp;days ✈️ </div>
              <div className='info-box'>You Selected - {leaveDays.length > 0 ? leaveDays.length : 0 } days ✈️ </div>
              <div className='info-box'>Start Date: <strong>&nbsp; {range[0]? (moment(range[0]).format('DD-MM-YYYY')) : ''}</strong></div>
              <div className='info-box'>End Date: <strong>&nbsp;  {range[1]? (moment(range[1]).format('DD-MM-YYYY')) : ''}</strong></div>
              <button className='button button--red u-margin-top-medium' disabled={validRequest} onClick={confirmRequest}>Confirm</button>
          </div>
        </div>
        
        <div>
         
    
          {/* <div className="dates-container u-margin-bottom-small">
          
          </div> */}
        </div>
      </div>)}
    </div>
  )
}
