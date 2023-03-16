import React, {useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Accordion } from "react-bootstrap";
import handleOrdenar from '../../common/ordenacao'


export default function GruposServicos({...props}) {
    const p = props;
    const [grupos, setGrupos] = useState([]);
    const [servicos, setServicos] = useState([]);
    
    useEffect(() => {
      const dadosGrupos = handleOrdenar(p.gruposServicos, 'nome', 'asc');
      setGrupos(dadosGrupos);

      const dadosServicos = handleOrdenar(p.servicos, 'idGrupoServico', 'asc');
      setServicos(dadosServicos);

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
      
      function agruparJson(dados, col) {
        var lookup = {};
        var items = dados;
        var result = [];

        for (var item, i = 0; item = items[i++];) {
          var name = item[col];
          if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(item);
          }
        }
        return result;
      }

    const montaServicos = (idServico) =>{
        let filtro = p.servicosFuncionarios.filter(objSF=>objSF.idServico === idServico);
        
        filtro = filtro.map((obj) => {
          return {
            _id: obj._id,
            idServico: obj.idServico,
            idFuncionario: obj.idFuncionario,
            funcionario: retornaFuncionario(obj.idFuncionario),
            servico: retornaServico(obj.idServico),
            preco: retornaPreco(obj.idServico)
          }
        });
        
        var agrupado = agruparJson(filtro, 'servico')

        console.log(agrupado)

        return agrupado.map((objA)=>{
          return (
            <div className="col-2 checkServico">
              <div className="col-2 tituloCheck">{objA.servico +' - R$'+ objA.preco}</div>
              {filtro.map((obj)=>{
                if (objA.servico  === obj.servico){
                  return <div><Form.Check type="checkbox" name={obj._id} id={obj._id} label={obj.funcionario} onChange={(item)=>onCkcChangeServico(item, obj.idServico+'|'+obj.idFuncionario +'|'+obj.preco)}/></div>
                }          
              })}
            </div>
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

  const tratamentoServicos = (dados, idServico) => handleOrdenar(dados.filter(obj=>obj.idGrupoServico === idServico), 'nome', 'asc');

  

  return (
    <div>
    <React.Fragment>                
        <Form.Label>Serviço - Profissional - Valor</Form.Label>
        
    {grupos && grupos.map(obj => (
        <Accordion key={obj._id} >   
                <Accordion.Item eventKey={obj._id}>
                <Accordion.Header>{obj.nome}</Accordion.Header>
                <Accordion.Body>
                <div className="container">
                <div className="row">
                            {
                                servicos && tratamentoServicos(servicos, obj._id).map(objS=>{
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

