import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, Prop, list } from "./generic";
import './style.css';

export default function Loading() {

 return(
    <div className="row">
        <div className="col"></div>
        <div className="col">
<Section>
    <Article key="spinningBubbles">
        <ReactLoading type="spinningBubbles" color="#fff" className="fundo-loading" height={'0px'} width={'50%'}/>
        <Prop>Carregando</Prop>
      </Article>    
  </Section>
  </div>
  <div className="col"></div>
  </div>
 )


}