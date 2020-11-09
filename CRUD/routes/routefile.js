const express = require('express');
const router = express.Router();
const Crud = require('../models/models');
const app = express();
const bodyParser = require('body-parser');
const proprietes = require('./propriety')

app.use(bodyParser.urlencoded({
    extended: true
}));

async function getLine(req, res, next) {
    try {
        let crud = await Crud.findById(req.params.id)
        if (crud == null) {
            return res.status(404).json({ message: 'Cant find subscriber' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.crud = crud
    next()
}

//make a post
router.post('/', async(req, res) => {
    const nouveau = new Crud(req.body)
    try {
        const newModel = await nouveau.save()
        res.status(201).json(newModel)
        console.log(newModel);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//lister
router.get('/getAll', async(req, res) => {
    try {
        const crud = await Crud.find()
        res.json(crud)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//afficher une ligne
router.get('/getOne/:id', getLine, (req, res) => {
    res.json(res.crud)
})

// Update one subscriber
router.patch('update/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = proprietes.propriety.tab;
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const _id = req.crud._id
    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid request' })
    }

    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }

    try {
        const updatedSubscriber = await res.crud.save()
        res.json(updatedSubscriber)
    } catch {
        res.status(400).json({ message: err.message })
    }
});

//supprimer une ligne
router.route('/delete/:id').delete((req, res, next) => {
    Crud.findOneAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                message: 'Deleted!!'
            })
        }
    })
})



module.exports = router;