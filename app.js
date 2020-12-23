const express = require('express');
const cors = require('cors');
const Excel = require('exceljs');
const excelToJson = require('convert-excel-to-json');
const path = require('path');
const app = express();

//app.use(cors);

//Default route
app.get('/', (req, resp) => {
    resp.send("Welcome to the server!");
});

//Get all the data from the master sheet
app.get('/get-master-data', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
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

//Get parts corresponding to a particular vehicle model
app.get('/get-parts', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    var filename = __dirname + "/src/test_sheet.xlsx";
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
    .then(function() {
        var data = [];
        var worksheet = workbook.getWorksheet("Sheet1");
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            var rowData = {};
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                rowData[colNumber] = cell.value;
            });
            data.push({ [rowNumber]: rowData });
        });
        resp.send(data);
    });
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running on port ${port}`));