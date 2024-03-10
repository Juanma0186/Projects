const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const path = require('path');
app.use(bodyParser.json());
app.use(cors());

app.post('/reclamaciones', (req, res) => {
  const reclamacion = req.body;
  const filePath = path.join(__dirname, 'src', 'assets', 'reclamaciones.json');

  fs.readFile(filePath, (err, fileData) => {
    if (err && err.code === 'ENOENT') {
      // Si el archivo no existe, crear un nuevo archivo con la reclamación
      return fs.writeFile(filePath, JSON.stringify([reclamacion], null, 4), error => {
        if (error) {
          console.error(error);
          return res.sendStatus(500);
        }
        res.json({ message: 'Reclamación enviada con éxito' });
      });
    } else if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    // Si el archivo existe, agregar la nueva reclamación
    const existingData = JSON.parse(fileData);
    existingData.push(reclamacion);

    fs.writeFile(filePath, JSON.stringify(existingData, null, 4), error => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }
      res.json({ message: 'Reclamación enviada con éxito' });
    });
  });
});

app.listen(3000, () => console.log('Servidor escuchando en el puerto 3000'));
