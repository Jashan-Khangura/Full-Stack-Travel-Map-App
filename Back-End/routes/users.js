const User = require('../models/User')
const router = require('express').Router()
const bcrypt = require('bcryptjs')

router.post("/register", async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(req.body.password, salt)
    
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashpassword
        })
        
        const user = await newUser.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post("/login", async (req, res) => {
    try {
       const user = await User.findOne({username: req.body.username})
       if (!user) {
           res.status(400).send("Wrong username or password.")
       }

       const validPassword = await bcrypt.compare(
           req.body.password, 
           user.password
           )
         
           if (!validPassword) {
            res.status(400).send("Wrong username or password.")
        }

        res.status(200).send({ _id: user._id, username: user.username })
    } catch (e) {
        res.status(500).send()
    }
})

//router.get("/GetUsers", async (req, res) => {
//    try {
//       const users = await User.find()
//       res.status(200).send(users)
//    } catch (e) {
//        res.status(500).send(e)
//    }
//})

module.exports = router