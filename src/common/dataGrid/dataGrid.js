import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import React, { StrictMode, useEffect, useMemo, useRef, useState } from 'react';


import './styles.css';

export default function DataGrid(props) {

  const [dados, setDados] = useState(props.data.tabela);
  const [fields, setFields] = useState(props.fields);
  const [tableName, setTableName] = useState(props.tableName);
  const gridRef = useRef(null);
  const [style, setStyle] = useState({
    height: '600px',
    width: '100%',
  });

  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
    };
  }, []);


  useEffect(() => {
    fields.push({ headerName: "Edição", cellRenderer: btnEdit},{ headerName: "Exclusão", cellRenderer: btnDelete})
    setFields(fields);
  }, []);

  const confimarExclusao = (id) => {
    props.setShowModal(true)
    props.setIdRegistro(id)
  }

  const handleEditar = (url) => {
    props.history.push(url);
  }


  const retornaServico = (id) => {
    return props.data.servicos.find(obj => obj._id === id) ? props.data.servicos.find(obj => obj._id === id).nome : '';
  }

  const retornaFuncionario = (id) => {
    return props.data.funcionarios.find(obj => obj._id === id) ? props.data.funcionarios.find(obj => obj._id === id).nome : '';
  }


  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 30, 40, 50];

  const btnDelete = (props) => {
    return <button type="button" className="btn btn-danger" onClick={() => confimarExclusao(props.data._id)}>
      <FontAwesomeIcon icon={solid('trash')} />
    </button>;
  };

  const btnEdit = (props) => {
    return <button type="button" className="btn btn-primary" onClick={() => handleEditar("/edit-" + tableName + "/" + props.data._id)}>
      <FontAwesomeIcon icon={solid('pen')} />
    </button>;
  };

  return (

    <StrictMode>
      <div className="example-wrapper">
        <div
          className={
            'grid-wrapper ' +
            "ag-theme-quartz"
          }
        >
          <div style={style}>
            <AgGridReact
              ref={gridRef}
              rowData={dados}
              defaultColDef={defaultColDef}
              columnDefs={fields}
              pagination={pagination}
              paginationPageSize={paginationPageSize}
              paginationPageSizeSelector={paginationPageSizeSelector}

            />
          </div>
        </div>
      </div>
    </StrictMode>


  )


}
