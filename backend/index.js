const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
require('./config/database');
const bodyParser = require('body-parser')

//Middleware:
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/employee'))
app.use('/', require('./routes/request'))

app.listen(3306, () => {
    console.log('App listening on port 3000!')
})
