const express = require('express')
const cors = require('cors')


const app = express()
const PORT = 1106

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '1000mb' }))

//route
const route = require('./routes/couchAPI')
const Gameroute = require('./routes/gameApi')
//api

app.use('/Employees',route)
app.use('/Game',Gameroute)



app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`)
})
