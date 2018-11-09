import React, { Component } from 'react';
import { Row, Col,Input, Modal,ModalHeader,ModalBody,ModalFooter,Button,ButtonGroup } from 'reactstrap';

import {modifyStock} from '../utils/apiUtilities' 



class TransactionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 2
    };

    this.numberStyle = {
      fontSize: "5rem",
      height: "100%",
      border: "white",
      borderColor: "white",
      textAlign: "center",
    }

    this.buttonStyle = {
      fontWeight: "500",
      fontSize: "2rem",
    }
  }

  handleTransaction(p){
    modifyStock(this.props.stock,p*this.state.quantity).then(()=>{
      this.props.onDone()
    })
  }
  
  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            <Input style={this.numberStyle} type="number" step="1" value={this.state.quantity} onChange={e => this.setState({quantity:e.target.value})}/>
          </ModalBody>
        
          <ModalFooter className="d-flex justify-content-center">
          
              <ButtonGroup className="w-100">
                  <Button style={this.buttonStyle} className="w-100" size="lg" color="success" onClick={e => this.handleTransaction(1)}>Add</Button>
                  <Button style={this.buttonStyle} className="w-100" size="lg" color="danger" onClick={e => this.handleTransaction(-1)}>Remove</Button>
              </ButtonGroup>
            
          </ModalFooter>

          
        </Modal>
    );
  }
}

export default TransactionModal;
