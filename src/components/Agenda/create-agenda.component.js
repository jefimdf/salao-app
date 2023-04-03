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
import situacao from '../../common/enum/situacao';
import Mensagem from '../../common/mensagem/Mensagem';
import Loading from '../../common/loading/loading';
import removeMascara from '../../common/removeMascara'
import Select from 'react-select';
import handleOrdenar from '../../common/ordenacao'

const tableName = 'agenda';

export default function CreateAgenda(props) {

  const [userLogado, setUserLogado] = useState(window.sessionStorage.getItem('userLogado') ? window.sessionStorage.getItem('userLogado') : false);
  const [idServico, setIdServico] = useState('')
  const [idFuncionario, setIdFuncionario] = useState('')
  const [idCliente, setIdCliente] = useState('')
  const [data, setData] = useState('')
  const [total, setTotal] = useState(0.0)
  const [hora, setHora] = useState('')
  const [celular, setCelular] = useState('')
  const [nome, setNome] = useState('')
  const [servicos, setServicos] = useState([])
  const [precos, setPrecos] = useState([])
  const [funcionariosTodos, setFuncionariosTodos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [clientes, setClientes] = useState([])
  const [agenda, setAgenda] = useState([])
  const [servicosFuncionarios, setServicosFuncionarios] = useState([])
  const [servicoSelecionado, setServicoSelecionado] = useState([])
  const [gruposServicos, setGruposServicos] = useState([])
  const [horarios, setHorarios] = useState(process.env.REACT_APP_HORARIOS.split(','));
  const [carregado, setCarregado] = useState(false);
  const [clienteLogado, setClienteLogado] = useState(null);
  const [mensagem, setMensagem] = useState({});
  const [comboClientes, setComboClientes] = useState([])

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
      
      objCliente = handleOrdenar(objCliente, 'nome', 'asc')

      setComboClientes(objCliente.map(obj=>{
        return {
          value: obj._id,
          label:obj.nome
        }
      }));

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

  const onChangeData = (date) => {
    let dataSelecionada = new Date(date)
    let teste = agenda.filter(obj => {
      var momentA = moment(new Date(obj.data)).valueOf();
      var momentB = moment(dataSelecionada).valueOf();      
      return momentA === momentB;      
    })

    setData(date)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (servicoSelecionado != undefined){

      setCarregado(false)
      
      servicoSelecionado.map(obj=>{
        
        var arr = obj.split('|');

        const objEnvio = {
          idServico: arr[0],
          idFuncionario: arr[1],
          idCliente: idCliente,
          data: data,
          hora: hora,
          total: arr[2],
          situacao: situacao[0]
        };

        axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
        .then(res => {
          if(userLogado){
            props.history.push('/'+tableName+'-list');
          }else{
            setMensagem({tipo: 'sucesso', mensagem:'Dados salvos com sucesso!'});
            window.location.reload();            
          }
          setCarregado(true)
        }).catch(err=> setMensagem({tipo: 'erro', mensagem:'Problema no cadastro'}));
      })
    }

  }

  const montaHorarios = () =>{
    let objAgenda = agenda.filter(obj => {
      var momentA = moment(new Date(obj.data)).valueOf();
      var momentB = moment(data).valueOf();      
      return momentA === momentB; })
    debugger

    objAgenda = objAgenda.filter(obj=>{
      return servicoSelecionado.find(o=>o.split('|')[1]===obj.idFuncionario)
    })
    
    console.log('servicoSelecionado', servicoSelecionado)

    let objhorarios = horarios.filter(obj=>!objAgenda.find(o=>o.hora===obj));

    return objhorarios.map((obj)=>{
      return (
        <div className="col-2 radioHoarario"><Form.Check type="radio" name="radioHorario" id={obj} label={obj} onChange={(item)=>onCkcChangeHorario(item)}/></div>        
      )
    })    
  }

  const onChangeCelular = (e) => {
    setNome('');
    setCelular(e.target.value);
  }

  const onChangeNome = (e) => {
    setCelular('');
    setNome(e.target.value);
  }

  const onBuscar = () =>{debugger
    if ((celular.length >= 9)){
      let obj = clientes;      
      if (celular.length >= 9)        
        obj = clientes.find(obj=> removeMascara(obj.celular) === '61'+celular);      
      if (obj){
        setIdCliente(obj._id);
        setClienteLogado(obj);      
        setMensagem({});
      }else{
        setIdCliente('');
        setClienteLogado(null);      
        setMensagem({tipo: 'alerta', mensagem:'Número de celular não localizado! Aguarde que vc está sendo redirecionado para o cadastro.'});        
        window.sessionStorage.setItem('cadastroUserExterno', true);
        setTimeout(() => {
          props.history.push('/create-cliente');  
        }, 5000);
        
      }      
    }
  }

  const onCkcChangeHorario = (item) => {
    setHora(item.target.id)
  }

  const onComboCliente = (e) => {    
    setIdCliente(e.value);
    setClienteLogado(clientes.find(obj=>obj._id===e.value));      
    setMensagem({});
  }
  
    return (<div className="form-wrapper">
      {!carregado && <Loading/>}
      {mensagem && <Mensagem tipo={mensagem.tipo} texto={mensagem.mensagem}/>}
      <Form onSubmit={onSubmit}>

        {carregado &&
        <Form.Group controlId="Cliente">
          <div className="row">
          <div className="col">
          <Form.Label>Cliente:</Form.Label>
          {!clienteLogado && !userLogado && <div>
          <div className="row">
            <MaskedFormControl type='text' name='celular' mask='111111111' value={celular} onChange={onChangeCelular} placeholder="Celular" />
          </div>
          <div className="row"><button type="button" className="btn btn-primary" onClick={onBuscar}>Buscar</button></div>
          </div>
          }
          {clienteLogado && !userLogado && <div className="row"><Form.Label>{clienteLogado.nome}</Form.Label></div>}          
          {userLogado && <div>
            <Select    
    name="colors"
    options={comboClientes}
    className="basic-multi-select"
    onChange={onComboCliente}
    placeholder="Selecione..."
    classNamePrefix="select"
  />
            </div>}
          </div>
          </div>
        </Form.Group>}

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

        {clienteLogado && <Form.Group controlId="Data">
          <Form.Label for="datac">Data:</Form.Label>          
          <div className="row">
          <div className="col-6">
          <DatePicker
            name="data"
            className="form-control"
            /* minDate={new Date()} */
            selected={data}
            onChange={onChangeData}
            dateFormat="dd/MM/yyyy"            
          />
          </div>
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
        
        {clienteLogado && 
        <Form.Group controlId="Total">
          <Row>
          <Form.Label>Valor Total: </Form.Label>    
          </Row>
          <Row>
          <Form.Label> <div className="valorTotal">R$ {total}.00 </div></Form.Label>          
          </Row>
        </Form.Group>
        }

      {clienteLogado && <Container id="Botoes">
      <Row>
              <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="submit" className="btn btn-primary" >Criar</button>
              {userLogado && <button type="button" className="btn btn-warning" onClick={cancelar}>Cancelar</button>}
            </div>
          </Row>
      </Container>}
        
        
      </Form>
    </div>);
  }

