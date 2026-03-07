require('dotenv').config();

const app = require('./src/app');
const conectDB = require('./src/config/db');

conectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});