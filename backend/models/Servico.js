const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let servicoSchema = new Schema({
  nome: {
    type: String
  }  
}, {
    collection: 'servicos'
  })

module.exports = mongoose.model('Servico', servicoSchema)