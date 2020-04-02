const {Router} = require('express');
const config = require('config');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.get('/', auth, async (req,res) => {
    try {
        const users = await User.find({  }) 
        res.json(users);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post(
    '/delete',
    async (req,res) => {
    try {
        const { delId } = req.body;
        if (delId != 0)
        {
        const candidate = await User.deleteMany({ _id: delId });
        if (delId.length > 1) {
            res.status(201).json({ message: 'Пользователи удалены' });
            }
            else {
                res.status(201).json({ message: 'Пользователь удален' });
            }
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/block',
    async (req,res) => {
    try {
        const { blockId } = req.body;
        if (blockId != 0) {
        const q = await User.updateMany({ '_id': blockId }, { $set: { 'blocked': true } });
        const status = await User.updateMany({'_id':blockId}, {$set: {'status': 'Заблокирован'}})
        if (blockId.length > 1) {
            res.status(201).json({ message: 'Пользователи заблокированы' });
            }
            else {
                res.status(201).json({ message: 'Пользователь заблокирован' });
            }
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/unblock',
    async (req,res) => {
    try {
        const { unblockId } = req.body;
        if (unblockId != 0) {
        const q = await User.updateMany({ '_id': unblockId }, { $set: { 'blocked': false } });
        const qq = await User.updateMany({'_id':unblockId}, {$set: {'status': 'Не заблокирован'}})
        if (unblockId.length > 1) {
        res.status(201).json({ message: 'Пользователи разблокированы' });
        }
        else {
            res.status(201).json({ message: 'Пользователь разблокирован' });
        }
    }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

module.exports = router;