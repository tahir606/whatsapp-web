const express = require('express');
const messageControl = require('./services/messageControl');

const app = express();

const port = 3200

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`WhatsApp Web App listening at http://localhost:${port}`);
    messageControl.startMessageService();
})
