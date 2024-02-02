import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


export default class ModalConfirmacao extends React.Component{
    
    render(){

        const p = this.props;

        return (
        <Modal show={p.show} onHide={p.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{p.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{p.Message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => p.handleClose(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => p.handleClose(true)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

        )
    }

}