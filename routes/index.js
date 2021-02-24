const { app } = require('electron');
const express = require('express');
const Excel = require('exceljs');
const multer = require('multer');
const path = require('path');
const router = express.Router();

router.get('/', (req, resp) => {
    resp.render('login');
});

router.get('/estimate', (req, resp) => {
    resp.render('estimate');
});

router.get('/files', (req, resp) => {
    resp.render('files');
});

router.get('/reports', (req, resp) => {
    resp.render('report');
});

router.get('/parts', (req, resp) => {
    resp.render('parts');
});

router.get('/test', (req, resp) => {
    resp.render('test');
});

router.post('/login', (req, resp) => {
    const { username, password } = req.body;

    var filename = "./uploads/Credentials.xlsx";
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
    .then(function() {
        var worksheet = workbook.getWorksheet(1);
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            var rowData = {};
            if(rowNumber > 1) {
                if(row.getCell(1).text == username) {
                    if(row.getCell(2).text == password) {
                        resp.redirect('/estimate?success=Authentication');
                    }
                    else {
                        resp.redirect('/?error=IncorrectPassword');
                    }
                }
                else {
                    resp.redirect('/?error=UserNotFound');
                }
            }
        });
    });
});

//File Upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".xlsx");
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 1*1000*1000 },
    fileFilter: function(req, file, cb) {
        var filetypes = /\.(xlsx|xls)/;
        if(!file) {
            next();
        }
        if(file.originalname.match(/\.(xlsx|xls)/)) {
            return cb(null, true);
        }
        cb("Error: file upload only supports the following filetypes - " + filetypes);
    }
}).single("inputFile");

//upload file to the server
router.post('/file-upload', (req, resp) => {
    upload(req, resp, function(err) {
        if(err) {
            resp.send(err);
        }
        else {
            resp.send("File Uploaded successfully");
        }
    });
});

module.exports = router;