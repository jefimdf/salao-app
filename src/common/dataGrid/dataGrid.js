import React, {useState, useEffect} from 'react'


export default function DataGrid(props) {

    const [dados, setDados] = useState(props.data);
    const [direcao, setDirecao] = useState('asc');

    useEffect(() => {
        
    }, []);


    const confimarExclusao = (id) => {
        props.setShowModal(true)
        props.setIdRegistro(id)    
      }
    
      const handleEditar = (url) =>{
        props.history.push(url);
      }

      const handleOrdenar = (col) =>{debugger        
        const data = dados.sort(function (a, b) {            
            if (direcao === 'desc'){
                if (a[col] > b[col]) {
                    return -1;
                }
                setDirecao('asc');
            }else{
                if (a[col] < b[col]) {
                    return -1;
                }
                setDirecao('desc');
            }            
        });
        setDados(data);                
      }

      const primeiraUpperCase = (v) => v.substr(0,1).toUpperCase() + v.substr(1,v.lenght)

    const dataTable = () => {
        return dados && dados.map((res) => {          
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
                    <th><a href="#" onClick={() => handleOrdenar(t)}>{primeiraUpperCase(t)}</a></th>
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
