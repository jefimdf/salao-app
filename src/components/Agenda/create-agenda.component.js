import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MaskedFormControl from 'react-bootstrap-maskedinput';
import '../Agenda/style.css';
import moment from 'moment';
import GruposServicos from './gruposServicos.component';


const tableName = 'agenda';

export default function CreateAgenda(props) {

  const [idServico, setIdServico] = useState('')
  const [idFuncionario, setIdFuncionario] = useState('')
  const [idCliente, setIdCliente] = useState('')
  const [data, setData] = useState('')
  const [total, setTotal] = useState('')
  const [hora, setHora] = useState('')
  const [servicos, setServicos] = useState([])
  const [precos, setPrecos] = useState([])
  const [funcionariosTodos, setFuncionariosTodos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [clientes, setClientes] = useState([])
  const [agenda, setAgenda] = useState([])
  const [servicosFuncionarios, setServicosFuncionarios] = useState([])
  const [servicoSelecionado, setServicoSelecionado] = useState([])
  const [gruposServicos, setGruposServicos] = useState([])
  const [horarios, setHorarios] = useState(['09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',])
  const [carregado, setCarregado] = useState(false);
  const [clienteLogado, setClienteLogado] = useState(null);

  useEffect(() => {
    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + 'servicoFuncionario/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'grupoServico/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'preco/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'cliente/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'agenda/')
        .then(res => res = res.data)
  ]

  Promise.all(requests)
    .then(([objServicoFuncionario, objGrupoServico, objServico, objPreco, objFuncionario, objCliente, objAgenda]) => {      
      
        setServicosFuncionarios(objServicoFuncionario);
        setGruposServicos(objGrupoServico);
        setServicos(objServico);
        setPrecos(objPreco);
        setFuncionarios(objFuncionario);
        setFuncionariosTodos(objFuncionario);
        setClientes(objCliente);
        setAgenda(objAgenda);    
        setCarregado(true);
      
    }, (evt) => {
        console.log(evt);        
    })

  }, []);

  const cancelar = () =>{
    props.history.push('/'+tableName+'-list');
  }

  const onChangeServico = (e) => {
    this.setState({ idServico: e.target.value })    
  }

  const onChangeFuncionario = (e) => {
    this.setState({ idFuncionario: e.target.value })
  }

  const onChangeCliente = (e) => {
    this.setState({ idCliente: e.target.value })
  }

  const onChangeData = (date) => {
    let dataSelecionada = new Date(date)
    let teste = agenda.filter(obj => {
      var momentA = moment(new Date(obj.data)).valueOf();
      var momentB = moment(dataSelecionada).valueOf();      
      return momentA === momentB;      
    })

    setData(date)
  }

  const onChangeHora= (e) => {    
    this.setState({ hora: e.target.value })
  }

  const onChangeTotal = (e) =>{
    this.setState({ total: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault();

    if (servicoSelecionado != undefined){
      
      servicoSelecionado.map(obj=>{
        
        var arr = obj.split('|');

        const objEnvio = {
          idServico: arr[0],
          idFuncionario: arr[1],
          idCliente: idCliente,
          data: data,
          hora: hora,
          total: total
        };

        axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
        .then(res => {
          props.history.push('/'+tableName+'-list');
        });
      })
    }

  }

  const montaHorarios = () =>{
    let objAgenda = agenda.filter(obj => {
      var momentA = moment(new Date(obj.data)).valueOf();
      var momentB = moment(data).valueOf();      
      return momentA === momentB; })
    
    let objhorarios = horarios.filter(obj=>!objAgenda.find(o=>o.hora===obj));

    return objhorarios.map((obj)=>{
      return (
        <div className="col-2 radioHoarario"><Form.Check type="radio" name="radioHorario" id={obj} label={obj} onChange={(item)=>onCkcChangeHorario(item)}/></div>        
      )
    })    
  }

  const onChangeCelular = (e) => {
    if (e.target.value.replaceAll('(', '').replaceAll(')', '').replaceAll('_', '').length >= 11){
      let obj = clientes.find(obj=>obj.celular === e.target.value);
      setIdCliente(obj._id);
      setClienteLogado(obj);      
    }
    
  }

  const onCkcChangeHorario = (item) => {
    setHora(item.target.id)
  }
  
    return (<div className="form-wrapper">
      
      <Form onSubmit={onSubmit}>

        <Form.Group controlId="Cliente">
          <Form.Label>Cliente:</Form.Label>
          {!clienteLogado && <MaskedFormControl type='text' name='celular' mask='(11)1111-1111' onChange={onChangeCelular} />}
          {clienteLogado && <div className="row"><Form.Label>{clienteLogado.nome}</Form.Label></div>}          
        </Form.Group>

        {carregado && clienteLogado && <GruposServicos 
         {...props}
        gruposServicos={gruposServicos} 
        servicos={servicos} 
        precos={precos} 
        funcionarios={funcionarios} 
        servicosFuncionarios={servicosFuncionarios}
        total={total}
        servicoSelecionado={servicoSelecionado}
        setTotal={setTotal}
        setServicoSelecionado={setServicoSelecionado}
        carregado={carregado}
        />  }

        {clienteLogado && <Form.Group controlId="data">
          <Form.Label for="datac">Data:</Form.Label>          
          <div className="row">
          <DatePicker
            name="data"
            className="form-control"
            minDate={new Date()}
            selected={data}
            onChange={onChangeData}
            dateFormat="dd/MM/yyyy"            
          />
          </div>
        </Form.Group>
        }

        {data && <Form.Group controlId="Hora">
          <Form.Label>Horário:</Form.Label>    
          <div className="container">
          <div className="row">
            {montaHorarios()}  
          </div>    
          </div>          
        </Form.Group>}
        
        {clienteLogado && <div className="valorTotal">
        <Form.Group controlId="Total">
          <Form.Label>Valor Total: </Form.Label>    
          <Form.Label> R$ {total}</Form.Label>
        </Form.Group>
        </div>}

      {clienteLogado && <Container id="Botoes">
      <Row>
              <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="submit" className="btn btn-primary" >Criar</button>
              <button type="button" className="btn btn-warning" onClick={cancelar}>Cancelar</button>
            </div>
          </Row>
      </Container>}
        
        
      </Form>
    </div>);
  }

