const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cors = require('cors');
const Excel = require('exceljs');
const excelToJson = require('convert-excel-to-json');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '1024mb', extended:true }));

//app.use(cors);

//Routes
app.use('/', require('./routes/index'));

//For Static Files
app.use(express.static(__dirname + '/assets'));

const models =  {
    //do again from the sheet
    "632": {"101": "Altroz XE 1.2 P", "138": "Altroz XE 1.2 P Rhytm", "105": "Altroz XM 1.2 P", "137": "Altroz XM 1.2 P Rhytm", "135": "Altroz XM 1.2 P Rhytm+Style", "103": "Altroz XT 1.2 P", "115": "Altroz XZ 1.2 P"},
    
    //do again from the sheet
    "631": {"091": "Harrier XE", "101": "Harrier XM", "103": "Harrier XM New", "111": "Harrier XZ", "112": "Harrier XZ New", "113": "Harrier XZ Dark Edition", "114": "Harrier XT Dark Edition", "115": "Harrier XZ (DT)", "121": "Harrier XT", "122": "Harrier XT New", "123": "Harrier XT", "512": "Harrier XZA", "523": "Harrier XZA+", "525": "Harrier XZ+ (DT) New", "527": "Harrier XZ Dark Edition New", "528": "Harrier XZ+ Dark Edition New", "531": "Harrier XZA+ Dark Edition", "538": "Harrier XT+", "558": "Harrier XT+ CAMO", "559": "Harrier XZ+ CAMO", "561": "Harrier XZA+ CAMO", "563": "Harrier XT+ Dark Edition"},
    
    "627": { "127": "Nexon (D) XZ+ New", "129":	"Nexon (P) XZ+ DT New", "130": "Nexon (P) XZA+ DT New", "131":	"Nexon (D) XE New", "132":	"Nexon (D) XM New", "134": "Nexon (D) XMA New", "141": "Nexon (P) XMA", "143": "Nexon (D) XZ+ DT (O) New", "143": "Nexon (D) XZ+ (O) New", "144": "Nexon (P) XZ+ (O) New", "144": "Nexon (P) XZ+ DT (O) New", "145": "Nexon (D) XZA+ (O) New", "146": "Nexon (P) XZA+ DT (O) New", "149": "Nexon (D) XZ+ (S) New", "150": "Nexon (D) XZA+ (S) New", "161": "Nexon (D) XT", "162":	"Nexon (D) XZ+", "165":	"Nexon (D) XZA+", "221": "Nexon (P) XM", "223":	"Nexon (P) XE New", "224": "Nexon (P) XM New", "225": "Nexon (P) XZ New", "226": "Nexon (P) XMA New", "227": "Nexon (P) XE",
    "230": "Nexon (P) KRAZ+", "231": "Nexon (P) XZ+ (S) New", "235": "Nexon (P) XZA+ (S) New", "241": "Nexon (D) XM (S)", "242": "Nexon (D) XMA (S)", "243": "Nexon (P) XM (S)", "244": "Nexon (P) XMA (S)", "261":	"Nexon (P) XT", "262": "Nexon (P) XZ+", "265": "Nexon (P) XZA+", "268": "Nexon (P) XT+" },

    "635": { "005": "Nexon EV XZ+ Lux", "006": "Nexon EV XZ+ Fleet" },
    
    "626": { "101": "Tiago XE 1.05 D", "182": "Tiago XT 1.05 D", "186": "Tiago (D) NRG", "190": "Tiago XZ 1.05 D (S)", "201": "Tiago XE 1.2 P", "203": "Tiago (P) XE New", "204": "Tiago XE 1.2 P (S)", "242": "Tiago XM 1.2 P (S)", "281": "Tiago XZ 1.2 P", "282": "Tiago XT 1.2 P", "283": "Tiago XZA 1.2 P", "288": "Tiago (P) XZ New", "289": "Tiago (P) NRG", "292": "Tiago (P) XT New", "292": "Tiago (P) XT New", "293": "Tiago (P) XZA New", "294": "Tiago XZ+ 1.2 P (ST)", "294": "Tiago XZ+ 1.2 P (DT)", "295": "Tiago XZA+ 1.2 P (ST)", "295": "Tiago XZA+ 1.2 P (DT)", "297": "Tiago XZ 1.2 P (S)", "298": "Tiago XZA 1.2 P (S)", "299": "Tiago (P) NRG S", "344": "Tiago XZO 1.2 P", "350": "Tiago (P) XZ+ DT New", "351": "Tiago (P) XZA+ DT New", "359": "Tiago (P) XT New" },
    
    "629": { "127": "Tigor XM 1.05 D", "202": "Tigor XE 1.2 P", "203": "Tigor (P) XE New", "227": "Tigor XM 1.2 P", "228": "Tigor (P) XM New", "305": "Tigor (P) XZ New", "303": "Tigor (P) XZ+ New", "527": "Tigor (P) XZA+ New", "276": "Tigor XZ 1.2 P", "304": "Tigor XZ+ 1.2 P", "526": "Tigor XZA 1.2 P", "528": "Tigor XZA+ 1.2 P", "624": "Tigor XM EV" },
    
    "614": { "703": "Hexa XE 4x2", "714": "Hexa XM 4x2", "717": "Hexa XM 4x2", "176": "Hexa XT 4x2", "753": "Hexa XTA 4x2" },
    
    "617": { "025": "Safari Storme Ex 4x2 Refreshed", "008": "Safari Storme Vx 4x2 Refreshed" },
    
    "446": { "229": "Sumo Gold EX MY14", },
    
    "624": { "004": "Zest XE QJT 75PS", "031": "Zest XM QJT 75PS", "051": "Zest XT QJT 90PS" }
};

const part_number = {
    "632": ["5442"],
    "631": ["5412"],
    "627": ["5438"],
    "626": ["5424"],
    "629": ["5425"],
    "614": ["2870"],
    "617": ["5407", "5408"],
    "446": ["2698"],
    "624": ["5422"]
};


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
        var filetypes = /xls|xlsx/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if(mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: file upload only supports the following filetypes - " + filetypes);
    }
}).single("customFile");

//Get car model based on chassis number
app.get('/get-model', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    const { chassis_no } = req.query;
    var modelNo = chassis_no.substring(3, 6);
    var subModelNo = chassis_no.substring(6, 9);
    var model = models[modelNo][subModelNo];
    var part_id = part_number[modelNo];
    var result = {};
    result["model"] = model;
    result["part_id"] = part_id;
    resp.send(result);
});

//Get all the data from the master sheet
app.get('/get-master-data', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    var path = __dirname + "/src/PRICE LIST 17 NOV2020.xlsx";
    //var path = __dirname + "/src/test_sheet.xlsx";
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
    const { part_id } = req.query;
    resp.setHeader('Access-Control-Allow-Origin', '*');
    var filename = __dirname + "/src/PRICE LIST 17 NOV2020.xlsx";
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
    .then(function() {
        var data = [];
        var pattern = "^" + part_id;
        var worksheet = workbook.getWorksheet(1);
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            var rowData = {};
            if(row.getCell(1).text.match(pattern)) {
                row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                    rowData[colNumber] = cell.value;
                });
                data.push(rowData);
            }
        });
        resp.send(data);
    });
});

//generate report
app.post('/invoice', (req, resp) => {
    //const {  } = req.body;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Invoice Data");

    worksheet.columns = [
        {header: 'Registration Number', key: 'registration_number', width: 32},
        {header: 'Chassis Number', key: 'chassis_number', width: 32}, 
        {header: 'Customer Name', key: 'customer_name', width: 10},
        {header: 'Contact Number', key: 'contact_number', width: 10},
        {header: 'Model', key: 'model', width: 15},
        {header: 'Estimate Date', key: 'estimate_date', width: 15},
        {header: 'Policy Number', key: 'policy_number', width: 15},
        {header: 'Policy Start', key: 'policy_start', width: 15},
        {header: 'policy_end', key: 'policy_end', width: 15},
    ];

    worksheet.addRow({
        registration_number: registration_number,
        chassis_number: chassis_number,
        customer_name: customer_name,
        contact_number: contact_number,
        model: model,
        estimate_date: estimate_date,
        policy_number: policy_number,
        policy_start: policy_start,
        policy_end: policy_end
    });

    workbook.xlsx.writeFile('/upload/report.xlsx');
    resp.send("Ok");
});

//upload file to the server
app.post('/file-upload', (req, resp) => {
    upload(req, resp, function(err) {
        if(err) {
            resp.send(err);
        }
        else {
            resp.send("File Uploaded successfully");
        }
    });
});

//get all files
app.get('/get-files', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    const directoryPath = path.join(__dirname, "uploads");
    fs.readdir(directoryPath, (err, files) => {
        if(err) {
            console.log("Unable to fetch files");
            resp.send("Unable to fetch files");
        }
        else {
            var fileInfo = [];
            files.forEach(file => {
                var fileName = file.substr(0, file.lastIndexOf('.'));
                var filePath = path.join("./uploads/" + file);
                var info = {};
                var stat = fs.statSync(filePath);
                var date = new Date(stat.birthtime);
                info[fileName] = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                fileInfo.push(info);
            });
            resp.send(fileInfo);
        }
    });
});

//Get report
app.get('/get-report', (req, resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.send("Ok");
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running on port ${port}`));