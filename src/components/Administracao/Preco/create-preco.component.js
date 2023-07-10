import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";


const tableName = 'preco';

export default class CreatePreco extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeServico = this.onChangeServico.bind(this);
    this.onChangePreco = this.onChangePreco.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // Setting up state
    this.state = {
      idServico: '',
      preco: '',
      data: '',
      servicos: []
    }
  }

  componentDidMount(){
    this.carregaServico();
  }

  carregaServico(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
    .then(res => {
      this.setState({
        servicos: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  cancelar(){
    this.props.history.push('/'+tableName+'-list');
  }

  onChangeServico(e) {
    this.setState({ idServico: e.target.value })
  }

  onChangePreco(e) {
    this.setState({ preco: e.target.value })
  }

  onChangeData = (date) => {
    this.setState({ data: date })
  }

  onSubmit(e) {
    e.preventDefault();

    const objEnvio = {
      idServico: this.state.idServico,
      preco: this.state.preco,
      data: this.state.data  
    };
debugger
    axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
      .then(res => {
        console.log(res.data); 
        this.props.history.push('/'+tableName+'-list');
      });

    this.state = {
      idServico: '',
      preco: '',
      data: '',
      servicos: []
    }
  }

  servicos(){
    return this.state.servicos.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>

        <Form.Group controlId="Servico">
          <Form.Label>Serviços</Form.Label>
          <Form.Control as="select" value={this.state.idServico} onChange={this.onChangeServico}>
            <option value="0">Selecione...</option>
            {this.servicos()}
          </Form.Control> 
        </Form.Group>

        <Form.Group controlId="data">
          <Form.Label for="datac">Data</Form.Label>          
        </Form.Group>
        <DatePicker
            name="data"
            className="form-control"
            selected={this.state.data}
            onChange={this.onChangeData}
            dateFormat="dd/MM/yyyy"            
          />

        <Form.Group controlId="Preco">
          <Form.Label>Preço</Form.Label>          
          <Form.Control type="text" value={this.state.preco} onChange={this.onChangePreco} placeholder="R$ 000,00"/>
        </Form.Group>
        

      <Container id="Botoes">
      <Row>
              <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="submit" className="btn btn-primary" >Criar</button>
              <button type="button" className="btn btn-warning" onClick={this.cancelar}>Cancelar</button>
            </div>
          </Row>
      </Container>
        
        
      </Form>
    </div>);
  }
}
