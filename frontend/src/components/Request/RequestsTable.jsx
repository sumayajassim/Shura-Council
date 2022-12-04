import React, {useEffect, useState} from 'react'
import Moment from 'react-moment';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from "react-router-dom";
import '../../style/_main.scss'

export default function RequestsTable(props) {
    const navigate = new useNavigate();
    const requestsList = props.requests;
    const [columns , setColumns] = useState([]);
    console.log('props', props.requests);
    console.log('requests',props.requests)
    function handleRequestClick(id){
        // e.preventDefault();
        if(props.role === 'Manager'){
            navigate(`/request/${id}`);
        }
        // props.requestID(props.request.id) 
    }
    useEffect(() =>{
            if(props.requestView){
                setColumns(['Type', 'Start Date', 'End Date', 'Number of Days', 'Status']);
            }else if((props.role && props.role === 'Employee')){
                setColumns(['Type', 'Start Date', 'End Date', 'Number of Days', 'Status', '']);
            }else if((props.role && props.role === 'Manager' ) ){
                setColumns(['Full name','Type', 'Start Date', 'End Date', 'Number of Days', 'Status']);
            }
    },[]) 
  return (
    <table className="stripped">
        <thead>
        <tr>
            {columns.map(column =>
            <th key={column}>{column}</th>
            )}
        </tr>
        </thead>
        <tbody>
            {requestsList.map(request => 
            <tr key={request.id} onClick={e => handleRequestClick(request.id)} className={props.role === 'Manager' ? 'pointer-cursor' : ''}>
                {(props.role === 'Manager' && !props.requestView) && 
                    <td>{request.Fname} {request.Lname}</td>
                }
                <td>{request.type}</td>
                <td><Moment format="D MMM YYYY">{request.startDate}</Moment></td>
                <td><Moment format="D MMM YYYY">{request.endDate}</Moment></td>
                <td>{request.numOfDays}</td>
                <td>
                {request.status === 'Accepted' && <Badge bg={'success'}>{request.status}</Badge> }
                {request.status === 'Rejected' && <Badge bg={'danger'}>{request.status}</Badge> }
                {request.status === 'Pending' && <Badge bg={'warning'}>{request.status}</Badge> }
                </td>
                {props.role === 'Employee' &&
                    <td>
                        <button className="button button--link"><i className="fa-sharp fa-solid fa-trash"></i></button>
                    </td>
                }
            </tr>
          )}
        </tbody>
    </table>
    )
}
