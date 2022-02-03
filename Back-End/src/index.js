const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRoute = require('../routes/users')
const pinRoute = require('../routes/pins')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use("/api/pins/", pinRoute)
app.use("/api/users/", userRoute)

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
.then(() => {
    console.log("MongoDB Connected")
})
.catch((err) => console.log(err))

app.listen(port, () => {
console.log("Server is up & running on PORT: " + port)
})