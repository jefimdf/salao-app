import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MaskedFormControl from 'react-bootstrap-maskedinput';


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
    this.onChangeServico = this.onChangeServico.bind(this);
    
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
      servicosFuncionarios: [],
      servicoSelecionado: []
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

  onChangeHora(e){    
    this.setState({ hora: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.servicoSelecionado != undefined){

      this.state.servicoSelecionado.map(obj=>{

        var arr = obj.split('|');

        const objEnvio = {
          idServico: arr[0],
          idFuncionario: arr[1],
          idCliente: this.state.idCliente,
          data: this.state.data,
          hora: this.state.hora
        };

        axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
        .then(res => {
          console.log(res.data); 
          this.props.history.push('/'+tableName+'-list');
        });
      })
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

  onChangeServico(item, chave){
    if (item.target.checked){
      this.state.servicoSelecionado.push(chave);
    }else{
      var retorno = this.state.servicoSelecionado.filter((obj)=>obj!=chave);
      this.setState({servicoSelecionado: retorno});
    }
  }

  montaServicos(){
    return this.state.servicosFuncionarios.map((obj)=>{
      return (
        <div className="mb-3">
          <Form.Check type="checkbox" label={this.retornaServico(obj.idServico) +' - '+ this.retornaFuncionario(obj.idFuncionario)} onChange={(item)=>this.onChangeServico(item, obj.idServico+'|'+obj.idFuncionario)}/>
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
          <MaskedFormControl type='text' name='hora' mask='11:11' value={this.state.hora} onChange={this.onChangeHora} />                 
        </Form.Group>
        
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
