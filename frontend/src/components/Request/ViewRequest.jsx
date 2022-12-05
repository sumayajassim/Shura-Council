import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import moment from 'moment/moment';
import RequestsTable from './RequestsTable';
import { toast } from 'react-toastify';


export default function ViewRequest() {
    const requestID = useParams().id;
    const [request, setRequest] = useState();
    const [previousRequest, setPreviousRequest] = useState();
    const endDate = moment().add(1, 'Y');
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({})
    const navigate = new useNavigate();
    const changeHandler = (e, show_) =>{
      if(show_ !==  undefined){
        setShow(show_)
      }

        const data = { ...formData };
        data[e.target.name] = e.target.value;
        setFormData(data);
        console.log(data)

      console.log(show)
    }

    useEffect(()=>{
        axios.get(`http://localhost:3306/request/${requestID}`)
        .then(res => {
          console.log(res.data)
          setRequest(res.data[0])
        })
        .catch(err => {
          console.log(err)
        })
        axios.get(`http://localhost:3306/request/employee/${requestID}`)
        .then(res => {
            console.log(res.data)
            setPreviousRequest(res.data)
          })
          .catch(err => {
            console.log(err)
        })
    },[])


    function confirmHandler(){
      if(formData.status === 'Rejected' && !formData.reason ){
        toast.error('Rejection reason is required!',{autoClose: 1500});
      }else{
        axios.put(`http://localhost:3306/request/${requestID}`, formData)
        .then(res => {
          navigate('/');
        })
      }
    }

    

  return (
    <div className='page-content'>
        <div className='container container--align-content-to-left'>
            {request &&<>
                <h3>Request sent by: <strong>&nbsp; {request.Fname} {request.Lname}</strong></h3>
                <div className='container--grid'>
                    <div className='grid-item'>
                      <Calendar
                      calendarType={'Hebrew'}
                      maxDate={new Date(endDate)}
                      minDate={new Date()}
                      view={"month"}
                      value={[new Date(request.startDate), new Date(request.endDate)]}/>
                    </div>
                    <div className="details-container grid-item">
                      <div className='info-box'>
                          Days Requested:  <strong>&nbsp; {request.numOfDays}</strong>
                      </div>
                      <div className='info-box'>
                          Available Leaves: <strong>&nbsp; {request.numOfLeaves}</strong>
                      </div>
                      <div className='info-box'>
                          Start Date: <strong>&nbsp; {moment(request.startDate).format('DD-MM-YYYY')}</strong>
                      </div>
                      <div className='info-box'>
                          End Date: <strong>&nbsp; {moment(request.endDate).format('DD-MM-YYYY')}</strong>
                      </div>

                      <div className='u-margin-top-small grid-item--column'>
                        <div className="u-margin-bottom-small">
                          <label className="request-status request-status--approve " htmlFor="approve">
                            <input type="radio" name="status" id="approve" value={"Approved"} onChange={(e) => changeHandler(e,false)}/>
                            <div className="request-status__content">
                              <i className="fa-solid fa-check"></i>
                              <div className="request-status--text">
                                <span>Approve</span>
                              </div>
                            </div>
                          </label>
                          <label className="request-status request-status--reject" htmlFor="reject">
                            <input type="radio" name="status" id="reject" value={"Rejected"}  onChange={(e) => changeHandler(e, true)}/>
                            <div className="request-status__content">
                            <i className="fa-solid fa-ban"></i>
                              <div className="request-status--text">
                                <span>Reject</span>
                              </div>
                            </div>
                          </label>
                        </div>
                        {show && <textarea name="reason" onChange={(e)=> changeHandler(e)} placeholder='Reason of rejection' className='u-margin-bottom-small reason-textarea' value={formData.reason} cols="30" rows="4"></textarea>}
                        <button type='submit' className='button button--green' onClick={confirmHandler} disabled={!formData.status}> Confirm </button>
                      </div>
                    </div>
                    <div className='grid-item'>
                      <h5 className='u-margin-bottom-small'>Previous requests :</h5>
                      {previousRequest && 
                        <div className='requests-list'>
                            <RequestsTable requests={previousRequest} requestView={true} role={"Manager"}/>
                        </div>
                      }
                    </div>
                </div>
                </>
              } 
        </div>
    </div>
  )
}