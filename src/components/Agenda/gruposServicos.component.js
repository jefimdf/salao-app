import React, {useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Accordion } from "react-bootstrap";


export default function GruposServicos({...props}) {
    const p = props;
    
    
    useEffect(() => {
        console.log(p);        
    }, []);

    const retornaServico = (id) =>{
        return p.servicos.find(obj=>obj._id===id).nome;
      }
    
      const retornaPreco = (id) =>{
        let valor = p.precos.find(obj=>obj.idServico===id).preco;
        valor = parseFloat(valor);
        return valor;
      }
    
      const retornaFuncionario = (id) =>{
       return  p.funcionarios.find(obj=>obj._id===id).nome;
      }
      
    const montaServicos = (idServico) =>{
        let filtro = p.servicosFuncionarios.filter(objSF=>objSF.idServico === idServico);
        return filtro.map((obj)=>{
          return (
            <div className="col-2 checkServico"><Form.Check type="checkbox" name={obj._id} id={obj._id} label={retornaServico(obj.idServico) +' - '+ retornaFuncionario(obj.idFuncionario) +' - R$'+ retornaPreco(obj.idServico)} onChange={(item)=>onCkcChangeServico(item, obj.idServico+'|'+obj.idFuncionario)}/></div>
          )
        })     
      }

      const onCkcChangeServico = (item, chave) => {
    
        let arr = chave.split('|');
        let total = parseFloat(p.total);
        

        var arraySelecao = p.servicoSelecionado.length <= 0 ? [] : p.servicoSelecionado;

        if (item.target.checked){
            arraySelecao.push(chave);
            total += retornaPreco(arr[0]);
            p.total=total;
            p.setTotal(total);
        }else{
          var retorno = arraySelecao.filter((obj)=>obj!=chave);
          arraySelecao = retorno;
          total -= retornaPreco(arr[0]);
          p.setTotal(total);
        }
debugger
        p.setServicoSelecionado(arraySelecao);

      }

  return (
    <div>
    <React.Fragment>                
        <Form.Label>Serviço - Profissional - Valor</Form.Label>
        
    {p.carregado && p.gruposServicos.map(obj => (         
        <Accordion key={obj._id} >   
                <Accordion.Item eventKey={obj._id}>
                <Accordion.Header>{obj.nome}</Accordion.Header>
                <Accordion.Body>
                <div className="container">
                <div className="row">
                            {
                                p.servicos.filter(objF=>objF.idGrupoServico === obj._id).map(objS=>{
                                    return (                                    
                                        montaServicos(objS._id)                                    
                                    )
                                })
                            }
                            </div>
                            </div>
                </Accordion.Body>
              </Accordion.Item>
              </Accordion>                    
            ))}
      
    
    </React.Fragment>
    </div>
  );
}

