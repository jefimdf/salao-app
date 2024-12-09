import axios from 'axios';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import DataGrid from '../../../common/dataGrid/dataGrid';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import Persistencia from '../Commom/persistencia';


const tableName = 'cidade';

export default function CidadeList(props) {

  const [showModal, setShowModal] = useState(false);
  const [idRegistro, setIdRegistro] = useState(0);
  const [data, setData] = useState({})
  const [carregado, setCarregado] = useState(false)

  const persistencia = new Persistencia({ props: props, tableName: tableName, setShowModal: setShowModal });

  useEffect(() => {

    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
        .then(res => res = res.data)
    ];

    Promise.all(requests)
      .then(([obj]) => {
        setData(obj)
        setCarregado(true)
      }, (evt) => {
        console.log(evt);
      });

  }, []);

  const handleClose = (status) => {
    if (status) {
      persistencia.handleDelete(idRegistro);
    }
    setShowModal(status);
  }

  const novo = () => {
    props.history.push('/create-' + tableName + '');
  }

  return (
    <div>
      <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de preço" Message="Deseja excluir o registro?" />
      <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>
      {carregado && <DataGrid
        {...props}
        fields={[{ field: "nome", filter: true, floatingFilter: true }]}
        data={data}
        edit={true}
        tableName={tableName}
        setShowModal={setShowModal}
        setIdRegistro={setIdRegistro}
      />}

    </div>

  );
}