import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import DataGrid from '../../../common/dataGrid/dataGrid'


const tableName = 'servico';

export default function ServicoList(props) {

  const [servicos, setServicos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [idRegistro, setIdRegistro] = useState(0)
  const [data, setData] = useState({})
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    const requests =[
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
    .then(res => res = res.data)
  ];

  Promise.all(requests)
      .then(([objServico]) => {        
        setData({
          servicos: objServico
      })
        setCarregado(true);
      }, (evt) => {
          console.log(evt);        
      })
  }, []);
  
    

  const handleDelete = (id) => {
    axios.delete(process.env.REACT_APP_URL_SERVER + tableName + '/delete/' + id)
        .then((res) => {
            console.log('Excluído com sucesso!');
            setShowModal(false)
            window.location.reload()            
        }).catch((error) => {
            console.log(error)
        })    
  }

  const handleClose = (status) =>{
    if (status){
      handleDelete(idRegistro);
    }
    setShowModal(status)    
  }

  const novo = () =>{
    props.history.push('/create-'+tableName);
  }
  
    return (
      <div>
        <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de serviço" Message="Deseja excluir o registro?" />
        {carregado && <DataGrid 
        {...props}
        fields={['nome','_id']}
        data={data.servicos} 
        tableName={tableName}
        setShowModal={setShowModal}
        setIdRegistro={setIdRegistro}
        />}
        <button type="button" className="btn btn-primary" onClick={novo}>Novo</button>        
      </div>
    
    );
  
}