import React, { useState, useEffect } from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import situacao from '../../common/enum/situacao';

const tableName = 'agenda';

export default function AgendaView(props) {
    
  const [agendas, setAgendas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [data, setData] = useState(new Date());
  const [agendasTodas, setAgendasTodas] = useState([]);
  
  useEffect(() => {
    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
      .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'cliente/')
        .then(res => res = res.data)
    ];

    Promise.all(requests)
      .then(([objAgenda, objServico, objFuncionario, objCliente]) => {
        setAgendas(filtraDadosAgenda(data, objAgenda));
        setAgendasTodas(objAgenda)
        setServicos(objServico)
        setFuncionarios(objFuncionario)
        setClientes(objCliente)
      }, (evt) => {
          console.log(evt);        
      });
  }, []);

    function Agenda(_id, idServico, idFuncionario, idCliente, data, hora, total, situacao){
      this._id = _id;
      this.idServico= idServico;
      this.idFuncionario= idFuncionario;
      this.idCliente= idCliente;
      this.data= data;
      this.hora= hora;
      this.total= total;
      this.situacao= situacao;
    }

    const filtraDadosAgenda = (date, obj) => obj.filter(obj=>dataString(date) === dataString(obj.data));
    
    const onChangeData = (date) => {
      setData(date)
      setAgendas(filtraDadosAgenda(date, agendasTodas));      
    }

    const dataString = (data) => (new Date(data)).getFullYear() + '' + (new Date(data)).getMonth() + '' + (new Date(data)).getDate();
    
    function retornaCliente(id){
      return (
           <div className="divNome">Cliente: {id ? clientes.find(obj=>obj._id===id).nome : ''} - {id ? clientes.find(obj=>obj._id===id).celular: ''}
           </div>
      );
    }

    const retornaServico = (id) => servicos.find(obj=>obj._id===id).nome;
    
    const retornaFuncionario = (id) =>funcionarios.find(obj=>obj._id===id).nome;
    
    function alteraSituacao(obj, situacao){

      obj = new Agenda(obj._id, obj.idServico, obj.idFuncionario, obj.idCliente, obj.data, obj.hora, obj.total, situacao);
      
      axios.put(process.env.REACT_APP_URL_SERVER + tableName + '/update/' + obj._id, obj)
        .then((res) => {
          window.location.reload();
        }).catch((error) => {
          console.log(error);
        })

    }

    function retornaInfo(objAgenda, idCliente, idServico, idFuncionario){
      return (
        <div className="divInfo">
          <div className="row align-items-center">
          <div className="col">
            {retornaCliente(idCliente)}
            <div className="divNome">Serviço: {retornaServico(idServico)}</div>
            <div className="divNome">Funcionário: {retornaFuncionario(idFuncionario)}</div>
            <div className="divNome">Situação: {objAgenda.situacao ? objAgenda.situacao : 'Marcado'}</div>
            </div>
            <div className="col">              
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              {objAgenda.situacao != situacao[1] ? <button type="button" className="btn btn-success" onClick={()=>alteraSituacao(objAgenda, situacao[1])}>V</button> : ''}
              {objAgenda.situacao != situacao[2] ? <button type="button" className="btn btn-danger" onClick={()=>alteraSituacao(objAgenda, situacao[2])}>X</button> : ''}
            </div>
              </div>
          </div>
        </div>
      )
    }

    function ordenarDados(props){
      props.sort((a, b)=>{
        let hA = parseInt(a.hora.replace(':', ''));
        let hB = parseInt(b.hora.replace(':', ''));
        if (hA > hB)
          return 1;
        if (hA < hB)
          return -1;
        return 0;
      });
      return props;
    }

    function retornaAgenda(props){

      let ordenado = ordenarDados(props);

      const itens = ordenado.map(obj=>   <div>     
            <div className="divHora">{obj.hora}</div>
            <div>
            {retornaInfo(obj, obj.idCliente, obj.idServico, obj.idFuncionario)}
            </div>
            </div>
       );

       return(
         <div>
           <div className="tdDia"><div className="divQuantidade">Você tem <span>{props.length}</span> atendimentos no dia</div></div>           
            {itens}          
         </div>
       )
      
    }

        return(
          <div className="form-wrapper">
            <Form >
              <DatePicker
                  name="data"
                  className="form-control"
                  selected={data}
                  onChange={onChangeData}
                  dateFormat="dd/MM/yyyy"            
                />

              {retornaAgenda(agendas)}
              
            </Form>
          </div>
        )
    

};
