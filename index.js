// required dependencies
require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

// import schema file
const schema = require('./server/schema');

const app = express();

//define URI
const uri = process.env.URI;

// connect to mongodb atlas database using my credentials
mongoose.connect(uri);
mongoose.connection.once('open', () => {
   console.log('Connected to database')
});

// middleware
app.use('/graphql', graphqlHTTP({
   schema,
   graphiql: true
}));

const port = process.env.PORT;
const message = process.env.MESSAGE;

// listen
app.listen(port, () => {
   console.log(`${message} ${port}`)
});