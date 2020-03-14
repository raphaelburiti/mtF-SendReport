const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-sw4jw.mongodb.net/mtFreeDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

app.use(cors());
app.use(express.json());
app.use(routes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => console.log(`Listening on ${ port }`));

// app.listen(9999);