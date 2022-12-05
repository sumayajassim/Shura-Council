import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export default function DeleteModal(props) {

    // const { show, onClose } = props;
  return (
    <div>
    <Modal show={props.show} onHide={props.onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Delete Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <div className="delete-text">
                  Are you sure you want to delete your request? 
                </div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={props.deleteRequest}>
                Delete
            </Button>
            <Button variant="secondary" onClick={props.onClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
</div>
  )
}

