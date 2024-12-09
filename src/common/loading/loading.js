import React from "react";
import ReactLoading from 'react-loading';
import { Article, Prop, Section } from "./generic";
import './style.css';


export default function Loading() {

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col">
                <Section>
                    <Article key="spinningBubbles" >
                        <ReactLoading type="spinningBubbles" color="#fff" height={'20%'} width={'20%'} /> 
                        
                        <Prop className="carregando">Carregando</Prop>
                    </Article>
                </Section>
            </div>
            <div className="col"></div>
        </div>
    )


}