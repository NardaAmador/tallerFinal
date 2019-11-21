const mongoose = require('mongoose');
const uri = "mongodb://narda:narduk1991@cluster1-shard-00-00-2ic0t.mongodb.net:27017,cluster1-shard-00-01-2ic0t.mongodb.net:27017,cluster1-shard-00-02-2ic0t.mongodb.net:27017/test?ssl=true&replicaSet=Cluster1-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })
    .then(db => { console.log('Conexión exitosa con cluster MongoDB: Atlas') })
    .catch(err => { console.log(err) });

module.exports = mongoose;