
// In this file we define and export the Types (as graphQL is strongly typed) we need for our GraphQl Schema
exports.typeDefs = `

type Trip {
    _id: ID
    name: String!
    category: String!
    description: String!
    instructions: String!
    createdDate: String
    likes: Int
    username: String
    lat: Float
    lon: Float
}

type User {
    _id: ID
    username: String! @unique
    password: String!
    email: String!
    joinDate: String
    favorites: [Trip]
}

type Query {
    getAllTrips: [Trip]
    getTrip(_id: ID!): Trip
    searchTrips(searchTerm: String): [Trip]
    getCurrentUser: User
    getUserTrips(username: String!): [Trip]
}

type Token {
    token: String!
}

type Mutation{
    addTrip(
        name: String!,
        category: String!, 
        description: String!, 
        instructions: String!, 
        createdDate: String, 
        likes: Int, 
        username: String,
        lat: Float,
        lon: Float
    ): Trip
    deleteUserTrip(_id: ID): Trip
    likeTrip(_id: ID!, username: String!): Trip
    unlikeTrip(_id: ID!, username: String!): Trip
    signInUser(
        username: String!,
        password: String!
    ): Token
    signUpUser(
        username: String!,
        email: String!,
        password: String!

    ): Token
}
`; 