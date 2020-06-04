const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Trip = require('./models/Trip');
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

//https://react-apollo-trip-reports.herokuapp.com/graphql
//http://localhost:3000
const corsOptions = {
    origin: 'https://react-apollo-trip-reports.herokuapp.com',
    credentials: true
}

app.use(cors(corsOptions));

// setup JWT authentication middleware
app.use(async (req, res, next) =>{
    console.log("Request here", {req})
    const token = req.headers['authorization'];
    console.log("token before conditional", token)
    if (token !== undefined){
        try {
            console.log("Secret here", process.env.SECRET)
            console.log("incoming token here", token)
            console.log("Awaiting verification...")
            const currentUser = await jwt.verify(token, process.env.SECRET) 
            console.log("current user verified", {currentUser})
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
            Trip,
            User,
            currentUser
        }
    }))
)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(
            __dirname, "client", "build", 'index.html'
        ))
    });
}
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`);
})