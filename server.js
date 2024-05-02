const express = require('express');
const app = express();
const PORT = 5550;

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
