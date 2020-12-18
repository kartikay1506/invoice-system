const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, resp) => {
    resp.send("Welcome to the server!");
});

app.get('/get-master-data', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    //resp.send("File Sent");
    resp.sendFile(__dirname + "/src/PRICE LIST 17 NOV2020.xlsx");
});



const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running on port ${port}`));