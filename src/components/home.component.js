import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function Home(props) {

    const [data, setData] = useState({})
    const [carregado, setCarregado] = useState(false)

    useEffect(() => {
        const requests =[
          axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data)
      ];
    
      Promise.all(requests)
          .then(([objServico]) => {        
            setData({
              tabela: objServico
          })
            setCarregado(true);
          }, (evt) => {
              console.log(evt);        
          })
      }, []);

  return (<div className="form-wrapper home">
    {carregado && <div><p className="titulo">Bem vindo(a)  ao salão Nádia Beauty Hair e Designer</p>
    
    <div className="fotoHome"></div>
    
    {/* <p className="subtitulo">Um prazer poder te atender</p>
    <p className="conteudo">Acesse o menu e agende um horário conosco</p>
    <div className="servicos">
        <p className="conteudo">Nosso salão dispõe dos seguintes serviços:</p>
        <ul>
            {data.tabela.map((obj) => 
                <li>{obj.nome}</li>    
            )}            
        </ul>
    </div> */}</div>}
    
</div>)


}