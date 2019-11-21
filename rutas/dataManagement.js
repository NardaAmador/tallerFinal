var router = require('express').Router();
const restaurantes = require('../modelos/Restaurantes');
const promociones = require('../modelos/Promociones');

//1
//Se crea el direccionamiento de la ruta de la petición para obtener las promociones vigentes
router.get('/promocionesVigentes', async (req, res) => {
    
    //Se declara una variable local para guardar la fecha del día en que se consulta
    let fechaHoy = new Date();

    //Se especifican los filtros de búsqueda por el atributo fechaExpiración que sea mayor que el día en el que se consulta
    promociones.find({fechaExpiracion : {$gt : new Date(fechaHoy)}})

    //Obtiene el resultado de la búsqueda en caso de ser positiva
    .then((promocionesVigentes) => {
        res.json({
            "status": "ok",
            //Pinta las promociones vigentes
            "nodo": promocionesVigentes
        });
    })

    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//2
//Se crea el direccionamiento de la ruta de la petición para obtener las promociones premium
router.get('/obtenerPromocionesPremium', async (req, res) => {

    //Se especifican los filtros de búsqueda por el atributo premium que tenga el valor de true (1) y un limit o máximo de 5 resultados
    promociones.find({premium:true}).limit(5)
    
    //Obtiene 5 promociones premium en el caso de que existan 5 en la DB
    .then((promosPremium) => {
        res.json({
            "status": "ok",
            //Pinta las primeras 5 promociones premium disponibles
            "nodo":promosPremium
        });
    })
        
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
        "status": "fail",
        "error": err
        });
    });
});

//3
//Se crea el direccionamiento de la ruta de la petición para obtener las promociones que están por expirar
router.get('/obtenerPromocionesPorExpirar', async (req, res) => {
    
    //Se declara una variable local para guardar la fecha del día en que se consulta
    let fechaHoy = new Date();
        
    //Se especifican los filtros de búsqueda por el atributo fechaExpiración que sea mayor que el día en el que se consulta y menor que la fecha en la que se desea establecer el límite
    promociones.find({fechaExpiracion : {$gt : new Date(fechaHoy) , $lt: new Date('2019-12-31')}})
        
    //Obtiene las promociones que expiran desde la fecha actual hasta el 31 de diciembre de 2019
    .then((promosPorExpirar) => {
        res.json({
            "status": "ok",
            //Pinta las promociones cercanas a expirar
            "nodo": promosPorExpirar
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//4
//Se crea el direccionamiento de la ruta de la petición para obtener la información de una promoción específica junto con la información del restaurante relacionado con la promoción
router.get('/obtenerInformacionPromocionEspecifica/:id', async (req, res) => {

    //Se declara una variable local para guardar el id de promoción que ingresa por parámetros
    let idTarget = req.params.id;

    //Se especifican los filtros de búsqueda por la variable idTarget donde se guardó el id que ingresó
    promociones.findById(idTarget)
    
    //Obtiene la promoción solicitada por medio del id
    .then((promocionEspecifica) => {

        //Se especifican los filtros de búsqueda desde la promoción encontrada con relación al id de restaurante que esta contiene
        restaurantes.findById(promocionEspecifica.idRestaurante)
        
        //Obtiene el restaurante relacionado con la promo por medio del id del restaurante
        .then((restauranteEnPromo) => {
            
            //Se declara una variable local para guardar la información de la promoción encontrada y la convierte en un objeto
            let promocionTarget = promocionEspecifica.toObject(); 
            res.json({
                "status": "ok",
                //Pinta el restaurante encontrado y su información
                "Restaurante" : restauranteEnPromo,
                //Pinta la promoción específica encontrada y su información
                "Promocion": promocionTarget
            });
        })
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//5
//Se crea el direccionamiento de la ruta de la petición para obtener todas las promociones de un restaurante
router.get('/obtenerPromocionesDeRestaurante/:id', async (req, res) => {

    //Se declara una variable local para guardar el id de restaurante que ingresa por parámetros
    let idTarget = req.params.id;

    //Se especifican los filtros de búsqueda por el atributo idRestaurante el cuál debe ser igual al id que ingresa por parámetros
    promociones.find({ idRestaurante: idTarget })

    //Obtiene las promociones del restaurante indicado desde parámetros
    .then((promosRestaurante) => {
        res.json({
            "status": "ok",
            //Pinta las promociones del restaurante indicado desde parámetros
            "curso": promosRestaurante
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//6
//Se crea el direccionamiento de la ruta de la petición para crear un nuevo restaurante
router.post('/nuevoRestaurante', async (req, res) => {

    //Se declara una variable local para guardar el nuevo restaurante dentro de un objeto JSON
    let miNuevoRestaurante = new restaurantes({

        //Se especifican los atributos de restaurante con sus respectivos requerimientos y se piden desde postman
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        localidad: req.body.localidad,
        telefono: req.body.telefono,
        activo: req.body.activo
    });

    //Guarda el objeto JSON en la DB
    miNuevoRestaurante.save()

    //Obtiene el objeto JSON creado
    .then((nodo) => {
        res.json({
            "status": "ok",
            //Pinta el objeto JSON que se creó
            "nodoCreado": nodo
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//7
//Se crea el direccionamiento de la ruta de la petición para crear una nueva promoción
router.post('/nuevaPromocion', async (req, res) => {

    //Se declara una variable local para guardar la nueva promoción dentro de un objeto JSON
    let nuevaPromocion = new promociones({

        //Se especifican los atributos de promoción con sus respectivos requerimientos y se piden desde postman
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        premium: req.body.premium,
        fechaCreacion: req.body.fechaCreacion,
        fechaExpiracion: req.body.fechaExpiracion,
        activa: req.body.activa,
        idRestaurante: req.body.idRestaurante

    });

    //Guarda el objeto JSON en la DB
    nuevaPromocion.save()

    //Obtiene el objeto JSON creado
    .then((nodo) => {
        res.json({
            "status": "ok",
            //Pinta el objeto JSON que se creó
            "nodoCreado": nodo
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//8 Restaurante
//Se crea el direccionamiento de la ruta de la petición para actualizar un dato de un restaurante
router.put('/actualizarDatoDeRestaurante/:id', async (req, res) => {

    //Se especifican los filtros de búsqueda por el parámetro id en restaurantes para actualizar en el restaurante encontrado un dato por medio de un query JSON
    restaurantes.findByIdAndUpdate(req.params.id, req.body.queryUpdate)

    //Obtiene los parámetros de la búsqueda 
    .then((nodo) => {
        res.json({
            "status": "ok",
            //Pinta el objeto JSON actualizado
            "nodoActualizado" : nodo
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//8 Promoción
//Se crea el direccionamiento de la ruta de la petición para actualizar un dato de un restaurante
router.put('/actualizarDatoPromocion/:id', async (req, res) => {

    //Se especifican los filtros de búsqueda por el parámetro id en promociones para actualizar en la promoción encontrada un dato por medio de un query JSON
    promociones.findByIdAndUpdate(req.params.id, req.body.queryUpdate)
     
    //Obtiene los parámetros de la búsqueda 
    .then(() => {
        res.json({
            "status": "ok",
            //Pinta el objeto JSON en el estado anterior a la actualización
            "nodoActualizado" : nodo
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//9 Restaurante
//Se crea el direccionamiento de la ruta de la petición para desactivar un restaurante
router.put('/desactivarUnRestaurante/:id', async (req, res) => {

    //Se especifican los filtros de búsqueda por el parámetro id en restaurantes para desactivar el restaurante encontrado configurando el atributo activo (que es un boolean) como 0 o false
    restaurantes.findByIdAndUpdate(req.params.id, {$set: { activo : 0 } })

    //Obtiene los parámetros de la búsqueda
    .then(() => {
        res.json({
            "status": "ok",
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//9 Promoción
//Se crea el direccionamiento de la ruta de la petición para desactivar una promoción
router.put('/desactivarUnaPromocion/:id', async (req, res) => {

    //Se especifican los filtros de búsqueda por el parámetro id en promociones para desactivar la promoción encontrada configurando el atributo activo (que es un boolean) como 0 o false
    promociones.findByIdAndUpdate(req.params.id, {$set: { activo : 0 } })

    //Obtiene los parámetros de la búsqueda
    .then(() => {
        res.json({
            "status": "ok",
        });
    })
    //Se muestra error en el requerimiento en caso de ser negativo
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

//REFERENCIA PARA BÚSQUEDA DE TODOS LOS RESTAURANTES
router.get('/obtenerTodosLosRestaurantes', async (req, res) => {

    restaurantes.find()
        .then((losNodos) => {
            res.json({
                "status": "ok",
                "restaurantes": losNodos
            });
        })
        .catch((err) => {
            res.json({
                "status": "fail",
                "error": err
            });
        });

});

//REFERENCIA PARA BÚSQUEDA DE TODAS LAS PROMOCIONES
router.get('/obtenerTodasLasPromociones', async (req, res) => {

    promociones.find()
    .then((losNodos) => {
        res.json({
            "status": "ok",
            "promociones": losNodos
        });
    })
    .catch((err) => {
        res.json({
            "status": "fail",
            "error": err
        });
    });
});

module.exports = router;
