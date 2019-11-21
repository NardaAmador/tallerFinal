const mongoose = require('mongoose');
const { Schema } = mongoose;

const promociones = new Schema();

promociones.add({
    nombre: {type: String, required:true},
    descripcion: {type: String, required:true},
    premium: {type:Boolean, required:true},
    fechaCreacion: {type: Date, required: true},
    fechaExpiracion: {type: Date, required: true},
    activa: {type: Boolean, required: true},
    idRestaurante: {type: String, required: true}
});

module.exports = mongoose.model('promociones', promociones);