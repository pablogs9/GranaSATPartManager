import React from 'react';
import axios from 'axios'

import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import Select from 'react-select'

import PartSearchBar from './PartSearchBar'
import AddPart from './AddPart'
import AddVendor from './AddVendor'
import VendorSearchBar from './VendorSearchBar'
import {createStock} from '../utils/apiUtilities'


class AddStockManual extends React.Component {
constructor(props) {
    super(props);
    this.state = {
      state: 0,
      part: null,
      vendor: null,
      vendorCode:null,
      vendorUrl:null,
      vendorImage: null,
      quantity:null,
      storageplace: null,
      quantity: 0,
      inseted: null,
      error: null,
      storageplaces: []
    };
  }
  componentDidMount(){
    axios.get('/api/storageplaces').then((data) => {
      data = data.data.results.map(e => {
        const p = {value : e, label: e.name}
        return p
      })

      var local = JSON.parse(localStorage.getItem('storageplace'))
      local = (local) ? data.filter(e => e.label === local.label) : []
      var defstorage = (local.length) ? local[0] : data[0];

      this.setState({storageplaces:data,storageplace:defstorage})
    })
  }
  createStockFromForm(){
    console.log("pepwrtf")
    createStock(this.state.part,this.state.vendor,this.state.vendorCode, this.state.vendorUrl,parseInt(this.state.quantity),this.state.storageplace,this.state.image)
    .then((data) => {
      console.log(data)
      if (data.data.error) {
        this.setState({error:data.data.error})
      }else{
        this.setState({inserted:data.data.inserted})
      }
    })
    .catch((error)=>{
      console.log(error);
      this.setState({error:error});

    });
  }
  back(){
    this.setState({
      state: 0,
      part: null,
      vendor: null,
      vendorCode:null,
      vendorUrl:null,
      vendorImage: null,
      quantity:null,
      storageplace: null,
      quantity: 0,
      inseted: null,
      error: null,
    })
  }


  render() {
    return (
      <div>
      {(this.state.state === 0)
        ?<div>
          <h2> Select part </h2>
          <PartSearchBar onSelect={(p)=>{this.setState({part: p}); console.log(p)}}></PartSearchBar>
          <h2> Create part </h2>
          <AddPart onDone={(p)=>{this.setState({part: p}); console.log(p)}}></AddPart>
          {this.state.part
            ? <Button size="sm" color="success" onClick={()=>{this.setState({state:1})}}>Next</Button>
            : <Button size="sm" disabled="true">Next</Button>}
        </div>
        :null
      }
      {(this.state.state === 1)
        ? <div>
          <h2> Select vendor </h2>
          <VendorSearchBar onSelect={(v) => {this.setState({vendor:v})}}></VendorSearchBar>
          <h2> Create Vendor </h2>
          <AddVendor onDone={(v) => {this.setState({vendor:v})}}></AddVendor>
          {this.state.vendor
            ? <Button size="sm" color="success" onClick={()=>{this.setState({state:2})}}>Next</Button>
            : <Button size="sm" disabled="true">Next</Button>}
        </div>
        : null
      }
      {(this.state.state === 2)
          ?<div>
           <Row>
             <Col md="9">
             <h2> {this.state.part.name} </h2> by {this.state.part.manufacturer+' '}
             and selled by <a target="_blank" href={this.state.vendor.url}>{this.state.vendor.name} </a>
             </Col>
             { (this.state.vendorImage) ?
                   <Col md="3">
                     <img src={this.state.vendorImage} style={{maxWidth: "100px"}} className="img-fluid"></img>
                   </Col>
             : null
             }
           </Row>
             <Form autoComplete="off">
               {(this.state.error)
                       ?   <Alert color="danger">
                               {this.state.error}
                           </Alert>
                       : null

               }
               <FormGroup>
                 <Label for="vendorCode">Vendor code</Label>
                 <Input type="text" name="vendorCode" value={this.state.vendorCode} id="vendorCode" placeholder="" onChange={(e)=>{this.setState({vendorCode:e.target.value})}}/>
               </FormGroup>
               <FormGroup>
                 <Label for="vendorUrl">URL</Label>
                 <Input type="text" name="vendorUrl" value={this.state.vendorUrl} id="vendorUrl" placeholder="" onChange={(e)=>{this.setState({vendorUrl:e.target.value})}}/>
               </FormGroup>
               <FormGroup>
                 <Label for="vendorImage">Part Image URL</Label>
                 <Input type="text" name="vendorImage" value={this.state.vendorImage} id="vendorImage" placeholder="" onChange={(e)=>{this.setState({vendorImage:e.target.value})}}/>
               </FormGroup>
               <FormGroup>
                 <Label for="quantity">Quantity</Label>
                 <Input type="number" step="1" name="quantity" value={this.state.quantity} id="quantity" placeholder="" onChange={(e)=>{this.setState({quantity:e.target.value})}}/>
               </FormGroup>
               <FormGroup>
                 <Label for="storageplaces">Storage Place</Label>
                 <Select name="storageplaces" selectProps="name" value={this.state.storageplace} options={this.state.storageplaces} onChange={s => {
                 this.setState({storageplace:s})
                 localStorage.setItem('storageplace', JSON.stringify(s));
                 }}></Select>
               </FormGroup>
               {(this.state.inserted)
                 ? <p>Inserted {JSON.stringify(this.state.inserted)}</p>
                 : null

               }
               <Button size="m" color="success" onClick={this.createStockFromForm.bind(this)}>Create Stock</Button>
               <Button size="m" color="success" onClick={this.back.bind(this)}>New Stock</Button>
             </Form>
         </div>
        : null
      }




      </div>

    );
  }
}
export default AddStockManual;
