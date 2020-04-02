const {Router} = require('express');
const config = require('config');
const shortid = require('shortid');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl');
        const {from} = req.body;
        const code = shortid.generate();
        /*const existing = await Link.findOne({ from });
        if (existing) {
            return res.json({ link: existing });
        } */
        const to = baseUrl + '/t/' + code;
        const link = new Link({
            text: from, code, to, from, owner: req.user.userId
        });
        await link.save();
        res.status(201).json({ link });
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post('/updateColor', auth, async (req, res) => {
    try {
        const {linkId, colorCard} = req.body;
        const upd = await Link.updateOne({ '_id': linkId }, { $set: {'color': colorCard} })
        res.status(201).json({ upd });
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post('/update', auth, async (req, res) => {
    try {
        const {from, linkId, colorCard} = req.body;
        const dateChange = Date.now();
        const upd = await Link.updateOne({ '_id': linkId }, { $set: {'text': from, 'dateChanged': dateChange, 'color': colorCard} })
        res.status(201).json({ upd });
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post('/updateXY', auth, async (req, res) => {
    try {
        const {note} = req.body;
        for (let i = 0; i < note.length; i++) {
        await Link.updateOne({ '_id': note[i].id }, { $set: {'x': note[i].x, 'y': note[i].y} })
        }
        res.status(201).json({ message: 'Сохранено' });
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})


router.post('/delete', auth, async (req, res) => {
    try {
        const {delId} = req.body;
        const del = await Link.deleteOne({ _id: delId })
        res.status(201).json({ del });
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.get('/', auth, async (req,res) => {
    try {
        const links = await Link.find({ owner: req.user.userId }) 
        res.json(links);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.get('/:id', auth, async (req,res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.json(link);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

module.exports = router;