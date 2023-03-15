import React, {useState, useEffect} from 'react'


export default function DataGrid(props) {


    useEffect(() => {
        console.log(props)

    }, []);


    const confimarExclusao = (id) => {
        props.setShowModal(true)
        props.setIdRegistro(id)    
      }
    
      const handleEditar = (url) =>{
        props.history.push(url);
      }

    const dataTable = () => {
        return props.data && props.data.map((res) => {          
          return (
            <tr>
                {props.fields.map((t)=>{
                    return Object.keys(res).find((o)=>o===t) ? <td>{res[t]}</td> : ''                    
                }                    
                )}                
                <td>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                  <button type="button" className="btn btn-primary" onClick={() => handleEditar("/edit-"+props.tableName+"/" + res._id)}>
                        Editar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => confimarExclusao(res._id)}>Excluir</button>
                </div>                
                </td>
            </tr>
          );    
        });
      }


    return(

        <div>
        <div className="table-wrapper">        
        <table className="table table-striped">
            <thead>
              <tr>
                {props.fields.map((t)=>
                    <th>{t}</th>
                )}                
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {dataTable()}
            </tbody>
          </table>          
        </div>        
      </div>

    )

    
}
