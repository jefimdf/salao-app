const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let precoSchema = new Schema({
  idServico: {
    type: String
  },
  preco: {
    type: Number
  },
  data: {
    type: Date
  }

}, {
    collection: 'precos'
  })

module.exports = mongoose.model('Preco', precoSchema)