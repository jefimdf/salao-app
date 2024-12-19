import axios from 'axios';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import DataGrid from '../../../common/dataGrid/dataGrid';
import { serverDateToString } from '../../../common/dateValidations';
import { formatMoney } from '../../../common/functions';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import Persistencia from '../Commom/persistencia';


const tableName = 'despesa';

export default function DespesaList(props) {

  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false)
  const [idRegistro, setIdRegistro] = useState(0)
  const [carregado, setCarregado] = useState(false)
  
  const persistencia = new Persistencia({ props: props, tableName: tableName, setShowModal: setShowModal });

  useEffect(() => {

    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'categoria/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'lancamento/')
        .then(res => res = res.data)
    ];

    Promise.all(requests)
      .then(([objDespesas, objCategoria, objLancamento]) => {

        objDespesas = objDespesas.map(obj => {
          return {
            ...obj,
            data: serverDateToString(obj.data),
            valor: formatMoney(obj.valor, 'R$'),
            categoria: objCategoria.find(o=>o._id===obj.categoria).name,
            lancamento: objLancamento.find(o=>o._id===obj.lancamento).name
          }
        })

        setData(objDespesas);

        setCarregado(true);


      })

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
      <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de cliente" Message="Deseja excluir o registro?" />
      <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>

      {carregado && <DataGrid
        {...props}
        fields={[{ field: "titulo", filter: true, floatingFilter: true },
        { field: "data", filter: true, floatingFilter: true },
        { field: "categoria", filter: true, floatingFilter: true },
        { field: "lancamento", filter: true, floatingFilter: true },
        ]}
        data={data}
        edit={true}
        tableName={tableName}
        setShowModal={setShowModal}
        setIdRegistro={setIdRegistro}
      />}

    </div>

  );
}
