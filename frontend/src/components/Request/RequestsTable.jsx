import React, {useEffect, useState} from 'react'
import Moment from 'react-moment';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from "react-router-dom";
import '../../style/_main.scss'
import axios from 'axios';
import DeleteModal from '../DeleteModal';
import { toast } from 'react-toastify';

export default function RequestsTable(props) {
    const navigate = new useNavigate();
    const requestsList = props.requests;
    const [columns , setColumns] = useState([]);
    const [show, setShow] = useState(false);
    const [id, setID] = useState();
    const handleClose = () => setShow(false);
    console.log('props', props.requests);
    console.log('requests',props.requests)
    function handleRequestClick(id){
        if(props.role === 'Manager'){
            navigate(`/request/${id}`);
        }
    }
    const handleDeleteRequest = (id) => {
        setID(id);
        setShow(true);
    }
    useEffect(() =>{
            if(props.requestView){
                setColumns(['Type', 'Start Date', 'End Date', 'Number of Days', 'Status', 'Rejection reason']);
            }else if((props.role && props.role === 'Employee')){
                setColumns(['Type', 'Start Date', 'End Date', 'Number of Days', 'Status', 'Rejection reason' ,'']);
            }else if((props.role && props.role === 'Manager' ) ){
                setColumns(['Full name','Type', 'Start Date', 'End Date', 'Number of Days', 'Status']);
            }
    },[]) 

    function deleteRequest(){
        axios.delete(`http://localhost:3306/request/${id}`)
        .then(res =>{
            toast('Your request has been deleted successfully')
            handleClose();
        })
        .then(() => props.updateTable())
        .catch((err) => console.log(err))
    }

  return (
    <>
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
                    {request.status === 'Approved' && <Badge bg={'success'}>{request.status}</Badge> }
                    {request.status === 'Rejected' && <Badge bg={'danger'}>{request.status}</Badge> }
                    {request.status === 'Pending' && <Badge bg={'warning'}>{request.status}</Badge> }
                    </td>
                    <td>
                    {request.status === 'Rejected' ?
                    request.rejectionReason : ' - '}
                    </td>
                    {props.role === 'Employee' &&
                        <td>
                            <button className="button button--link" disabled={request.status === 'Rejected'|| request.status === 'Approved'} onClick={(e) => handleDeleteRequest(request.id)}><i className="fa-sharp fa-solid fa-trash"></i></button>
                        </td>
                    }
                </tr>
                )}
            </tbody>
        </table>
        <DeleteModal show={show} onClose={handleClose} id={id} deleteRequest={deleteRequest}/>
    </>
    )
}
