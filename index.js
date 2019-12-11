// required dependencies
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

// import schema file
const schema = require('./server/schema');

const app = express();

// import cloudinary helper
const cloudRouter = require('./server/helpers/cloudRouter');

// import responses
const r = require('./server/helpers/responses');

//define URI
const uri = process.env.URI;

// connect to mongodb atlas database using my credentials
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.once('open', () => {
   console.log('Connected to database')
});

// middleware
app.use(helmet());
app.use(cors());
app.use('/api', cloudRouter);
app.use('/graphql', graphqlHTTP({
   schema,
   graphiql: true
}));

// send base response using REST
app.get('/', (req, res) => {
   try {
      res.status(200).json(r.connected(req.ip));
   } catch (error) {
      res.status(500).json(error.message); l
   }
})

const port = process.env.PORT;
const message = process.env.MESSAGE;

// listen
app.listen(port, () => {
   console.log(`${message} ${port}`)
});