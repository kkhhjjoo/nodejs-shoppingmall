require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes/index');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //req.body가 객체로 인식이 됩니다

app.use('/api', indexRouter);

const mongoURI = process.env.LOCAL_DB_ADDRESS
mongoose.connect(mongoURI).then(() => console.log("mongoose connected")).catch((err) => console.log('DB connection fail', err));

app.listen(process.env.PORT || 8080, () => { 
  console.log("server on")
})