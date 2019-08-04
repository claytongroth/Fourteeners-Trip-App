const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const User = require('./models/User');
const bodParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path: 'variables.env'});

// bringing in graphQL Express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const jwt = require("jsonwebtoken");

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
// here we connect to the MongoAtlas DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log('DB connected'))
    .catch( err => console.log(err));

// Initializes aplication.
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));

// setup JWT authentication middleware
app.use(async (req, res, next) =>{
    const token = req.headers['authorization'];
    if (token !== "null"){
        try {
           const currentUser = await jwt.verify(token, process.env.secret) 
            req.currentUser = currentUser;
        } catch (error) {
            console.log(error)
        }
    }
    next();
});

//Connecting our Schemas with GraphQL
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}
))

app.use(
    '/graphql', 
    bodParser.json(),
    graphqlExpress(({currentUser}) => ({
        schema,
        context:{
            Recipe,
            User,
            currentUser
        }
    }))
)


const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`);
})