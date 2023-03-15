import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import { serverDateToString } from "../../../common/dateValidations";

const tableName = 'preco';

export default function PrecoList(props){
  
  const [precos, setPrecos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [idRegistro, setIdRegistro] = useState(0);
  const [servicos, setServicos] = useState([]);
  
  useEffect(() => {
    
    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
      .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data)      
    ];

    Promise.all(requests)
      .then(([objPreco, objServico]) => {
        setServicos(objServico);
        setPrecos(objPreco)
        
      }, (evt) => {
          console.log(evt);        
      });

    }, []);

  const handleDelete = (id) => {
    axios.delete(process.env.REACT_APP_URL_SERVER + tableName + '/delete/' + id)
        .then((res) => {
            console.log('Excluído com sucesso!');
            setShowModal(false)
            window.location.reload();
        }).catch((error) => {
            console.log(error)
        })    
  }

  const confimarExclusao = (id) =>{
    setShowModal(true)
    setIdRegistro(id)

  }

  const handleClose = (status) => {
    if (status){
      handleDelete(idRegistro);
    }
    setShowModal(status);    
  }

  const novo = () => {
    props.history.push('/create-'+tableName+'');
  }

  const retornaServico = (id) =>{
    return servicos.find(obj=>obj._id===id).nome;
  }

  const handleEditar = (url) =>{
    props.history.push(url);
  }

  const DataTable = () => {
    return precos.map((res) => {
      return (
        <tr>
            <td>{retornaServico(res.idServico)}</td>
            <td>{res.preco}</td>
            <td>{serverDateToString(res.data)}</td>
            <td>
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="button" className="btn btn-primary" onClick={() => handleEditar("/edit-"+tableName+"/" + res._id)}>
                    Editar
              </button>
              <button type="button" className="btn btn-danger" onClick={() => confimarExclusao(res._id)}>Excluir</button>
            </div>              
            </td>
        </tr>
      );

    });
  }
    
    return (
      <div>
        <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de preço" Message="Deseja excluir o registro?" />
        <div className="table-wrapper">        
        <table className="table table-striped">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Preço</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {DataTable()}
            </tbody>
          </table>          
        </div>
        <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>        
      </div>
    
    );
  
}