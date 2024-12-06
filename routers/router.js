const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'PComponents'})
});

router.get('/add', (req, res) => {
    res.render('add', {title: 'Add'})
});

router.post('/add', (req, res) => {
    res.render('add', {title: 'Add'})
});

module.exports = router;