import React, { useState, useEffect } from "react";


export default function Home(props) {

  return (<div className="form-wrapper home">
    <p className="titulo">Bem vindo(a)  ao salão Nádia Beauty Hair e Designer</p>
    <p className="subtitulo">Um prazer poder te atender</p>
    <p className="conteudo">Acesse o menu e agende um horário conosco</p>
    <div className="servicos">
        <p className="conteudo">Nosso salão dispõe dos seguintes serviços:</p>
        <ul>
            <li>Unhas pé e mão</li>
            <li>Pintura de cabelo</li>
            <li>Corte de cabelo</li>
            <li>Morena Iluminada</li>
            <li>Luzes</li>
            <li>Spar da beleza</li>
            <li>Depilação</li>
            <li>Progressiva</li>
            <li>Hidratação</li>
        </ul>
    </div>
</div>)


}