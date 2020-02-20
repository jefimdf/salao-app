import React, { Component } from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";

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
            agendas: this.filtraDadosAgenda(objAgenda),
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

    filtraDadosAgenda = (obj) => {
      let agendaFiltro = obj.filter((obj)=>{
        let d = new Date(obj.data);        
        return this.dataString(d) === this.dataString(this.state.data);;        
      });
      return agendaFiltro;
    }

    onChangeData = (date) => {
      this.setState({ data: date, agendas: this.filtraDadosAgenda(this.state.agendasTodas)});      
    }

    dataString(d){
      let dia = d.getDay();
      let mes = d.getMonth();
      let ano = d.getFullYear();

      return ano + '' + mes + '' + dia;
    }

    retornaCliente(id){
      return (
        <div>
          <div className="divNome">{this.state.clientes.find(obj=>obj._id===id).nome}</div>
          <div className="divCelular">{this.state.clientes.find(obj=>obj._id===id).celular}</div>          
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
      return (
        <div className="divDia">
          <span className="spanDia">{d.getDate()}</span>
          <span>{d.getMonth() + '/' + d.getFullYear()}</span>
        </div>
      );
    }

    retornaInfo(idCliente, idServico, idFuncionario){
      return (
        <div className="divInfo">
          <div className="divCliente">{this.retornaCliente(idCliente)}</div>
          <div className="divServico">{this.retornaServico(idServico)}</div>
          <div className="divFuncionario">{this.retornaFuncionario(idFuncionario)}</div>
        </div>
      )
    }

    retornaAgenda(){

      return this.state.agendas.map(obj=>{
        return (
          <tr>
            <td className="tdDia">{this.retornaDataFormatada(obj.data)}</td>
            <td>{this.retornaInfo(obj.idCliente, obj.idServico, obj.idFuncionario)}</td>
          </tr>
        )
      });
      
    }


    render(){
        return(
          <div className="form-wrapper">
            <Form onSubmit={this.onSubmit}>
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

              <div>
                <table>
                  {this.retornaAgenda()}                  
                </table>
              </div>

            </Form>
          </div>
        )
    }

};
