import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, Prop, list } from "./generic";
import './style.css';

export default function Loading() {

 return(
<Section>

    <Article key="spinningBubbles">
        <ReactLoading type="spinningBubbles" color="#fff" />
        <Prop>Carregando</Prop>
      </Article>    
  </Section>
 )


}