import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";


const tableName = 'agenda';

export default class CreateAgenda extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeServico = this.onChangeServico.bind(this);
    this.onChangeFuncionario = this.onChangeFuncionario.bind(this);
    this.onChangeCliente = this.onChangeCliente.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
    this.onChangeHora = this.onChangeHora.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // Setting up state
    this.state = {
      idServico: '',
      idFuncionario: '',
      idCliente: '',
      data: '',
      hora: '',
      servicos: [],
      funcionariosTodos: [],
      funcionarios: [],
      clientes: [],
      servicosFuncionarios: []
    }
  }

  componentDidMount(){
    this.carregaServico();
    this.carregaFuncionario();
    this.carregaCliente();
    this.carregaServicoFuncionario();
  }

  carregaServicoFuncionario(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'servicoFuncionario/')
    .then(res => {
      this.setState({
        servicosFuncionarios: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
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

  carregaFuncionario(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
    .then(res => {
      this.setState({
        funcionarios: res.data,
        funcionariosTodos: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  carregaCliente(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'cliente/')
    .then(res => {
      this.setState({
        clientes: res.data
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
    /* var servfunc = this.state.servicosFuncionarios.filter(obj=>obj.idServico === e.target.value);

    var test = [];
    servfunc.map(obj2 => {
      var func = this.state.funcionariosTodos.filter(obj=>obj._id===obj2.idFuncionario);            
      if (func!=undefined)
        test.push(func);
    });

    this.setState({ funcionarios: test }) */

  }

  onChangeFuncionario(e) {
    this.setState({ idFuncionario: e.target.value })
  }

  onChangeCliente(e) {
    this.setState({ idCliente: e.target.value })
  }

  onChangeData = (date) => {
    this.setState({ data: date })
  }

  onChangeHora(e) {
    this.setState({ hora: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault();

    const objEnvio = {
      idServico: this.state.idServico,
      idFuncionario: this.state.idFuncionario,
      idCliente: this.state.idCliente,
      data: this.state.data,
      hora: this.state.hora
    };

    debugger

    axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
      .then(res => {
        console.log(res.data); 
        this.props.history.push('/'+tableName+'-list');
      });

    this.state = {
      idServico: '',
      idFuncionario: '',
      idCliente: '',
      data: '',
      hora: '',
      servicos: [],
      funcionarios: [],
      clientes: []
    }
  }

  servicos(){
    return this.state.servicos.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  funcionarios(){
    return this.state.funcionarios.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  clientes(){
    return this.state.clientes.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  retornaServico(id){
    return this.state.servicos.find(obj=>obj._id===id).nome;
  }

  retornaFuncionario(id){
    return this.state.funcionarios.find(obj=>obj._id===id).nome;
  }

  montaServicos(){
    return this.state.servicosFuncionarios.map((obj)=>{
      return (
        <div className="mb-3">
          <Form.Check type="checkbox" label={this.retornaServico(obj.idServico) +' - '+ this.retornaFuncionario(obj.idFuncionario)} />
        </div>
      )
    })
    
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>

        <Form.Group controlId="Cliente">
          <Form.Label>Cliente</Form.Label>
          <Form.Control as="select" value={this.state.idCliente} onChange={this.onChangeCliente}>
            <option value="0">Selecione...</option>
            {this.clientes()}
          </Form.Control> 
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Label>Serviço - Funcionário</Form.Label>
          {this.montaServicos()}          
        </Form.Group>

        <Form.Group controlId="data">
          <Form.Label for="datac">Data</Form.Label>          
        </Form.Group>
        <DatePicker
            name="data"
            className="form-control"
            minDate={new Date()}
            selected={this.state.data}
            onChange={this.onChangeData}
            dateFormat="dd/MM/yyyy"            
          />

        <Form.Group controlId="Hora">
          <Form.Label>Hora</Form.Label>                    
        </Form.Group>
        <DatePicker
            name="hora"
            className="form-control"
            minDate={new Date()}
            selected={this.state.data}
            onChange={this.onChangeData}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        

      <Container id="Botoes">
        <Row>
          <Col><Button variant="danger" size="lg" block="block" type="submit">Criar</Button></Col>
          <Col><Button variant="warning" size="lg" block="block" type="button" onClick={this.cancelar}>Cancelar</Button></Col>          
        </Row>
      </Container>
        
        
      </Form>
    </div>);
  }
}
