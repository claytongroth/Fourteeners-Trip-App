// In this file we define our resolvers
// these are the actions we can call on our GraphQL data
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
    const {username, email} = user;
    return jwt.sign({username, email}, secret, { expiresIn })
}

exports.resolvers = {

    Query: {
        getAllTrips: async (root, args, { Trip }) => {
            console.log("getAllTrips fired")
            const allTrips = await Trip.find().sort({
                createdDate: "desc"
            });
            return allTrips;    
        },
        getTrip: async (root, {_id}, {Trip}) => {
            const trip = await Trip.findOne({_id});
            return trip;
        },
        searchTrips: async (root,{searchTerm}, {Trip}) => {
            if (searchTerm){
                const searchResults = await Trip.find({
                    $text: { $search: searchTerm }
                }, { 
                    score: { $meta: "textScore"}
                }).sort({
                    score:{$meta: "textScore"}
                });
                return searchResults;
            } else {
                const trips = await Trip.find().sort({ likes: 'desc', createdDate: 'desc'});
                return trips;
            }
            
        },
        getUserTrips: async (root, {username}, {Trip}) =>{
            const userTrips = await Trip.find({username}).sort({
                createdDate: 'desc'
            });
            return userTrips
        },
        getCurrentUser: async (root, args, {currentUser, User}) => {
            if(!currentUser){
                return null;
            }
            const user = await User.findOne({ username: currentUser.username})
            .populate({
                path: 'favorites',
                model: 'Trip'
            });
            return user;
        }
    },
    Mutation: {
        addTrip: async (root, {name, description, category, instructions, username, lat, lon}, {Trip} ) => {
            console.log(lat, lon, username)
            const newTrip = await new Trip({
                name,
                description,
                category,
                instructions,
                username,
                lat,
                lon
            }).save();
            return newTrip;
        },
        signInUser: async (root, {username, password}, {User}) => {
            const user = await User.findOne({username});
            if(!user){
                throw new Error('User not Found');
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword){
                throw new Error('Invalid password');
            }
            return { token: createToken(user, process.env.SECRET, '1hr')}
        },
        signUpUser : async (root, { username, email, password }, { User }) =>{
            console.log("signUpUser fired")
            let user;
            try {
                user = await User.findOne({username});

            } catch (err) {
                console.log(err)
                throw new Error(err)
            }
            if (user){
                throw new Error("User already exists!")
            }
            const newUser = await new User({
                username,
                email,
                password
            }).save();
            const token = createToken(newUser, process.env.SECRET, '1hr')
            console.log("signUpUser trying to return ", token)
            return { token }
        },
        likeTrip: async (root, {_id, username}, {Trip, User})=>{
            const trip = await Trip.findOneAndUpdate({ _id}, {$inc: {likes: 1}});
            const user = await User.findOneAndUpdate({username}, {$addToSet: {
                favorites: _id
            }});
            return trip;
        },
        unlikeTrip: async (root, {_id, username}, {Trip, User})=>{
            const trip = await Trip.findOneAndUpdate({ _id}, {$inc: {likes: -1}});
            const user = await User.findOneAndUpdate({username}, {$pull: {
                favorites: _id
            }});
            return trip;
        },
        deleteUserTrip: async (root, {_id}, {Trip}) => {
            const trip = await Trip.findOneAndRemove({_id});
            return trip;
        }
    }

};