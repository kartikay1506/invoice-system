const { app } = require('electron');
const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    resp.render('invoice');
});

router.get('/invoice', (req, resp) => {
    resp.render('invoice');
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

module.exports = router;