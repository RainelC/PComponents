const express = require('express');
const router = express.Router();
const model = require('../models/pcParts');
const multer = require('multer');
const path = require('path');

const { availableMemory, title } = require('process');
const { userInfo } = require('os');
const { error } = require('console');

const folderUpload = path.join(__dirname, '../upload');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, folderUpload);
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
});

var upload = multer({
    storage: storage
}).single('photo');

router.get('/', async (req, res) => {
    try{
        const components = await model.find({})
        res.render('index', {title: 'PComponents', data: components})
    }
    catch(error){
        res.json({message: error.message});
    }
});

router.get('/add', (req, res) => {
    res.render('add', {title: 'Add'})
});

router.post('/add', upload, (req, res) => {
    const component = new model({
        product_code: req.body.code,
        name: req.body.name,
        product_photo: req.file.filename,
        description: req.body.description,
        available: req.body.amount,
        price: req.body.price
    });

    component.save().then(() => {
        console.log("Save Success");
        res.redirect('/');
    }).catch((error) => {
        console.log(error);
    });
});

// Edit 

router.get('/edit/:id', async (req, res) =>{
    const id = req.params.id;

    try{
        const component = await model.findById(id);

        if(component == null){
            res.redirect('/');
        }
        else{
            res.render('edit', {
                title: "Edit Component",
                data: component
            })
        }
    }
    catch(error) {
        res.status(500).send();
    }

})

router.post('/update/:id', upload, async(req, res) => {
   const id = req.params.id; 
    let new_image = '';

    if(req.file){
        new_image = req.file.filename

        try{
            fs.unlinkSync('./upload/' + req.body.old_image)
        }
        catch(error) {
            console.log(error)
        }
    }
    else{
        new_image = req.body.old_image
    }
    try{
        await model.$where.findByIdAndUpdate(id, {
            product_code: req.body.code,
            name: req.body.name,
            product_photo: req.body.photo,
            description:req.body.description,
            available:req.body.amount,
            price: req.body.price,
        })

        res.redirect('/');
    }
    catch(error) {
    }
})


// Delete
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id

    try {
        const component = await model.findByIdAndDelete(id);

        if (component != null && component.image != '') {
            try {
                fs.unlinkSync('./upload/' + component.product_photo)
            }
            catch(error) {
                console.log(error);
            }
        }

        req.session.message = {
            message: 'Artículo eliminado correctamente!',
            type: 'info'
        }

        res.redirect('/')
    }
    catch(error) {
        res.json({
            message: error.message,
            type: 'danger'
        })
    }
})

module.exports = router;