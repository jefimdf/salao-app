import React, { useState, useEffect } from "react";

export default function Mensagem(props) {

    const [tipo, setTipo] = useState('');

    useEffect(() => {
        if (props.tipo === 'erro'){
            setTipo('alert alert-danger');
        }else if (props.tipo === 'sucesso'){
            setTipo('alert alert-success');
        }else if (props.tipo === 'alerta'){
            setTipo('alert alert-warning');
        }        
    });
    
    return(
        <div className={tipo} role="alert">{props.texto}</div>
    );

}