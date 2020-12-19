const express = require('express');
const cors = require('cors');
const excelToJson = require('convert-excel-to-json');
const path = require('path');
const app = express();

//app.use(cors);

app.get('/', (req, resp) => {
    resp.send("Welcome to the server!");
});

app.get('/get-master-data', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    //resp.send("File Sent");
    //resp.sendFile(__dirname + "/src/PRICE LIST 17 NOV2020.xlsx");
    //var path = __dirname + "/src/PRICE LIST 17 NOV2020.xlsx";
    var path = __dirname + "/src/test_sheet.xlsx";
    const result = excelToJson({
        sourceFile: path,
        /* header: {
            rows: 1
        } */
    });
    if(result) {
        resp.send(result);
    }
    else {
        resp.send("Error parsing excel sheet");
    }
});



const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running on port ${port}`));