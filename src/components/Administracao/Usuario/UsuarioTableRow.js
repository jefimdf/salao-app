import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const tableName = 'usuario';

export default class UsuarioTableRow extends Component {

    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }

    delete() {
        axios.delete(process.env.URL_SERVER + tableName + '/delete/' + this.props.obj._id)
            .then((res) => {
                console.log('Excluído com sucesso!')
            }).catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <tr>
                <td>{this.props.obj.nome}</td>
                <td>{this.props.obj.email}</td>
                <td>{this.props.obj.senha}</td>
                <td>
                    <Link className="edit-link" to={"/edit-usuario/" + this.props.obj._id}>
                        Editar
                    </Link>
                    <Button onClick={this.delete} size="sm" variant="danger">Deletar</Button>
                </td>
            </tr>
        );
    }
}