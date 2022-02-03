const Pin = require('../models/Pin')
const router = require('express').Router()

router.post('/', async (req, res) => {
    const newPin = new Pin(req.body)
    try {
       const savedPin = await newPin.save()
       res.status(200).send(savedPin)
    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/', async (req, res) => {
    try {
       const pins = await Pin.find()

       res.status(200).send(pins)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router