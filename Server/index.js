const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { getDocument, getPreguntas, getPregunta } = require("./mongoDB.js");
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/getEjercicio',(req,res) => {
    getDocument().then((document) => {
        getPreguntas(document.preguntas).then((preguntas) => {
            var ejercicio = {
                "nombre": document.nombre,
                "preguntas": []
            }
            for(var i = 0; i < preguntas.length; i++){
                console.log(preguntas[i]);
                ejercicio.preguntas.push(preguntas[i]);
            }
            res.json(ejercicio);
        });
        
    });
    
    
    
});

//idPregunta: 1, respuesta: "1111"
app.post('/pregunta', async (req,res) => {
    var pregunta  = await getPregunta(req.body.idPregunta);
    res.json(pregunta);
})
app.post('/comprobarPregunta', async (req, res) => {
    try {
        respuesta = req.body.respuesta;
        preguntas = await getPregunta(req.body.idPregunta);
        preguntas.forEach((pregunta) => {
            
        
        console.log("Formato recibido: ",pregunta.formato);

        if (pregunta.formato === "Seleccionar" || pregunta.formato === "Imagen" || pregunta.formato === "Ordenar valores") {
            if (respuesta === pregunta.correcta) {
                console.log("Selección correcta")
                res.json({ "correct": true });
            } else {
                console.log("Selección incorrecta")
                res.json({ "correct": false });
            }
        } else if (pregunta.formato === "Respuesta") {
            if (pregunta.correcta.includes(respuesta)) {
                res.json({ "correct": true });
            } else {
                res.json({ "correct": false });
            }
        } else if (pregunta.formato === "Grafica") {
            if (respuesta.tipo === pregunta.correcta.tipo) {
                if (respuesta.tipo === "horizontal" && respuesta.y === pregunta.correcta.y) {
                    res.json({ "correct": true });
                } else if (respuesta.tipo === "vertical" && respuesta.x === pregunta.correcta.x) {
                    res.json({ "correct": true });
                } else if (respuesta.tipo === "lineal" && respuesta.m === pregunta.correcta.m && respuesta.b === pregunta.correcta.b) {
                    res.json({ "correct": true });
                } else {
                    res.json({ "correct": false });
                }
            } else {
                res.json({ "correct": false });
            }
        } else if (pregunta.formato === "Unir valores") {
            const respuestaString = respuesta.map(arr => arr.join(',')).sort().join(';');
            const correctaString = pregunta.correcta.map(arr => arr.join(',')).sort().join(';');

            if (respuestaString === correctaString) {
                 res.json({ "correct": true });
            } else {
                res.json({ "correct": false });
            }
        } else {
            res.json({ "correct": false }); // Handle default case
        }
    });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
