import React from 'react'
import axios from 'axios';

export default class Persistencia {

    constructor(props) {
        this.props = props
        this.tableName= props.tableName
        this.setShowModal= props.setShowModal   
    }
    
    handleDelete = (id) => {
        axios.delete(process.env.REACT_APP_URL_SERVER + this.tableName + '/delete/' + id)
            .then((res) => {
                console.log('Excluído com sucesso!');
                this.setShowModal(false)
                window.location.reload();
            }).catch((error) => {
                console.log(error)
            })    
    }

    handleCreate = (objEnvio) => {
        axios.post(process.env.REACT_APP_URL_SERVER + this.tableName + '/create', objEnvio)
        .then(res => {
          console.log(res.data); 
          this.props.history.push('/'+this.tableName+'-list');
        });
    }
    

};




      
      
 

