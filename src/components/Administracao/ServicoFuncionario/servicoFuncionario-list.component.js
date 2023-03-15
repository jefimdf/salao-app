import React, { useState, useEffect } from "react";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import DataGrid from '../../../common/dataGrid/dataGrid'
import Persistencia from '../Commom/persistencia'

const tableName = 'servicoFuncionario';

export default function ServicoFuncionarioList(props) {

  const [data, setData] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [idRegistro, setIdRegistro] = useState(0)
  const [carregado, setCarregado] = useState(false)

  const persistencia = new Persistencia({props: props, tableName: tableName, setShowModal: setShowModal});

  useEffect(() => {
    
    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
      .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data)            
    ];

    Promise.all(requests)
      .then(([objServFuncionarios, objFuncionarios, objServicos]) => {
        setData({
          tabela: objServFuncionarios,
          funcionarios: objFuncionarios,
          servicos: objServicos
        })
        setCarregado(true)

      }, (evt) => {
          console.log(evt);        
      });

    }, []);

    const handleClose = (status) => {
      if (status){        
        persistencia.handleDelete(idRegistro);
      }
      setShowModal(status);    
    }
  
    const novo = () => {
      props.history.push('/create-'+tableName+'');
    }

    return (
      <div>
        <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de serviço de funcionário" Message="Deseja excluir o registro?" />
        {carregado && <DataGrid 
        {...props}
        fields={['idFuncionario', 'idServico', 'percentual']}
        data={data} 
        tableName={tableName}
        setShowModal={setShowModal}
        setIdRegistro={setIdRegistro}
        />}
        <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>        
      </div>
    
    );
  
}