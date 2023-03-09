import React, { Component } from "react";
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

export default class AgendaView extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
          agendas: [],
          showModal: false,
          idRegistro: 0,
          clientes: [],
          funcionarios: [],
          servicos: [],
          servicosFuncionarios: [],
          data: new Date(),
          agendasTodas: []
        };
    
        this.onChangeData = this.onChangeData.bind(this);
        this.filtraDadosAgenda = this.filtraDadosAgenda.bind(this);
        this.dataString = this.dataString.bind(this);

      }

    componentDidMount() {
      const requests = [
        axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
        .then(res => res = res.data),
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
      ];
  
      Promise.all(requests)
        .then(([objAgenda, objServicoFuncionario, objServico, objPreco, objFuncionario, objCliente]) => {
          this.setState({
            agendasTodas: objAgenda,
            agendas: this.filtraDadosAgenda(this.state.data, objAgenda),
            servicosFuncionarios: objServicoFuncionario,
            servicos: objServico,
            precos: objPreco,
            funcionarios: objFuncionario,
            clientes: objCliente          
          });
  
        }, (evt) => {
            console.log(evt);        
        });
    }

    filtraDadosAgenda = (date, obj) => {
      
      this.setState({agendas:[]});
      
      let filtro=[];
      const agendaFiltro = obj.map(obj=>{
        let d = new Date(obj.data);     
        let dataSelecionada = this.dataString(date);
        let dataBase = this.dataString(d);

        if (dataSelecionada === dataBase){
          
          filtro.push(obj);        
        }
      });

      return filtro;
    }

    onChangeData = (date) => {

      let obj = this.filtraDadosAgenda(date, this.state.agendasTodas);

      this.setState({ data: date, agendas: obj});      
    }

    dataString = (d) => {
      let dia = d.getDate();
      let mes = d.getMonth();
      let ano = d.getFullYear();

      return ano + '' + mes + '' + dia;
    }

    retornaCliente(id){
      return (
           <div className="divNome">Cliente: {id ? this.state.clientes.find(obj=>obj._id===id).nome : ''} - {id ? this.state.clientes.find(obj=>obj._id===id).celular: ''}
           </div>
      );
    }

    retornaServico(id){
      return this.state.servicos.find(obj=>obj._id===id).nome;
    }

    retornaFuncionario(id){
      return this.state.funcionarios.find(obj=>obj._id===id).nome;
    }

    retornaDataFormatada(data){
      let d = new Date(data);
      let dia = d.getDate();
      let mes = d.getMonth();

      mes += 1;

      if (dia < 10){
        dia = '0' + dia;
      }

      if (mes < 10){
        mes = '0' + mes;
      }

      return (
        <div className="divDia">
          <span className="spanDia">{dia + '/' + mes + '/' + d.getFullYear()}</span>          
        </div>
      );
    }

    alteraSituacao(objAgenda, situacao){

      const objEnvio = {
        idServico: objAgenda.idServico,
        idFuncionario: objAgenda.idFuncionario,
        idCliente: objAgenda.idCliente,
        data: objAgenda.data,
        hora: objAgenda.hora,
        total: objAgenda.total,
        situacao: situacao
      };

      axios.put(process.env.REACT_APP_URL_SERVER + tableName + '/update/' + objAgenda._id, objEnvio)
        .then((res) => {
          window.location.reload();
        }).catch((error) => {
          console.log(error);
        })


    }

    retornaInfo(objAgenda, idCliente, idServico, idFuncionario){
      return (
        <div className="divInfo">
          <div className="row align-items-center">
          <div className="col">
            {this.retornaCliente(idCliente)}
            <div className="divNome">Serviço: {this.retornaServico(idServico)}</div>
            <div className="divNome">Funcionário: {this.retornaFuncionario(idFuncionario)}</div>
            <div className="divNome">Situação: {objAgenda.situacao ? objAgenda.situacao : 'Marcado'}</div>
            </div>
            <div className="col">              
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              {objAgenda.situacao != situacao[1] ? <button type="button" className="btn btn-success" onClick={()=>this.alteraSituacao(objAgenda, situacao[1])}>V</button> : ''}
              {objAgenda.situacao != situacao[2] ? <button type="button" className="btn btn-danger" onClick={()=>this.alteraSituacao(objAgenda, situacao[2])}>X</button> : ''}
            </div>
              </div>
          </div>
        </div>
      )
    }

    ordenarDados(props){
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

    retornaAgenda(props){

      let ordenado = this.ordenarDados(props);

      const itens = ordenado.map(obj=>   <div>     
            <div className="divHora">{obj.hora}</div>
            <div>
            {this.retornaInfo(obj, obj.idCliente, obj.idServico, obj.idFuncionario)}
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

    render(){
        return(
          <div className="form-wrapper">
            <Form onSubmit={this.onSubmit}>
              <DatePicker
                  name="data"
                  className="form-control"
                  selected={this.state.data}
                  onChange={this.onChangeData}
                  dateFormat="dd/MM/yyyy"            
                />

              {this.retornaAgenda(this.state.agendas)}
              
            </Form>
          </div>
        )
    }

};
