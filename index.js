const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { mongoose } = require('./database.js');

const app = express();

//Configuración de peticiones con CORS
const whitelist = ["http://localhost:3000"]

app.use(cors({
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // },
  
origin: "*",
methods: ["GET", "POST", "PATCH", "PUT", "DETELE"],
exposedHeaders: ["Content-Type"],
optionsSuccessStatus: 200
}));

//Configuración del servidor:
const port = process.env.PORT || 5000
app.set('port', port);

//Utilidades:
app.use(morgan('dev'));
app.use(express.json());

//Rutas:
app.use('/data', require('./rutas/dataManagement.js'));
//Listener principal:
app.listen(port, function () {
  console.log(`Servidor corriendo en puerto: ${port}`);
});