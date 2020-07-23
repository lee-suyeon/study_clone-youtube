const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://suyeon:dltndus1@youtube-clone.zw9my.mongodb.net/admin?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! 안녕하세요'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))