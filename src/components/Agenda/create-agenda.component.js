import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MaskedFormControl from 'react-bootstrap-maskedinput';
import '../Agenda/style.css';

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
      total: 0,
      servicos: [],
      precos: [],
      funcionariosTodos: [],
      funcionarios: [],
      clientes: [],
      servicosFuncionarios: [],
      servicoSelecionado: []
    }
  }

  componentDidMount(){

    const requests = [
        axios.get(process.env.REACT_APP_URL_SERVER + 'servicoFuncionario/')
          .then(res => res = res.data),
        axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
          .then(res => res = res.data),
        axios.get(process.env.REACT_APP_URL_SERVER + 'preco/')
          .then(res => res = res.data),
        axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
          .then(res => res = res.data),
        axios.get(process.env.REACT_APP_URL_SERVER + 'cliente/')
          .then(res => res = res.data)
    ]

    Promise.all(requests)
      .then(([objServicoFuncionario, objServico, objPreco, objFuncionario, objCliente]) => {
        this.setState({
          servicosFuncionarios: objServicoFuncionario,
          servicos: objServico,
          precos: objPreco,
          funcionarios: objFuncionario,
          funcionariosTodos: objFuncionario,
          clientes: objCliente
        });

      }, (evt) => {
          console.log(evt);        
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

  onChangeTotal(e){
    this.setState({ total: e.target.value })
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
          hora: this.state.hora,
          total: this.state.total
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

  optionsClientes(){
    return this.state.clientes.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  retornaServico(id){
    return this.state.servicos.find(obj=>obj._id===id).nome;
  }

  retornaPreco(id){
    return this.state.precos.find(obj=>obj.idServico===id).preco;
  }

  retornaFuncionario(id){
    return this.state.funcionarios.find(obj=>obj._id===id).nome;
  }

  onCkcChangeServico(item, chave){
    
    let arr = chave.split('|');
    let total = this.state.total;

    if (item.target.checked){
      this.state.servicoSelecionado.push(chave);
      total += this.retornaPreco(arr[0]);
      this.setState({total: total});
    }else{
      var retorno = this.state.servicoSelecionado.filter((obj)=>obj!=chave);
      this.setState({servicoSelecionado: retorno});
      total -= this.retornaPreco(arr[0]);
      this.setState({total: total});
    }
  }

  montaServicos(){
    return this.state.servicosFuncionarios.map((obj)=>{
      return (
        <li><Form.Check type="checkbox" name={obj._id} id={obj._id} label={this.retornaServico(obj.idServico) +' - '+ this.retornaFuncionario(obj.idFuncionario) +' - R$'+ this.retornaPreco(obj.idServico)} onChange={(item)=>this.onCkcChangeServico(item, obj.idServico+'|'+obj.idFuncionario)}/></li>        
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
            {this.optionsClientes()}
          </Form.Control> 
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">

          <Form.Label>Serviço - Funcionário</Form.Label>
          <ul className="ks-cboxtags">
            {this.montaServicos()}  
          </ul>        
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
        
        <div className="valorTotal">
        <Form.Group controlId="Hora">
          <Form.Label>Valor Total: </Form.Label>    
          <Form.Label> R$ {this.state.total}</Form.Label>
        </Form.Group>
        </div>

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
