import { gql } from 'apollo-boost';

//trips queries
export const GET_ALL_TRIPS = gql`
query {
    getAllTrips {
        _id
        name
        category
        description
        instructions
        username
        lat
        lon
    }
}
`;
export const GET_TRIP = gql`
  query($_id: ID!) {
    getTrip(_id: $_id){
      _id
      name
      category
      description
      instructions
      createdDate
      likes
      username
      lat
      lon
    }
  }
`;

export const SEARCH_TRIPS = gql`
  query($searchTerm: String){
    searchTrips(searchTerm: $searchTerm){
      _id
      name
      likes
    }
  }
`;

//trip mutations
export const ADD_TRIP = gql`
  mutation(
    $name: String!,
    $category: String!, 
    $description: String!, 
    $instructions: String!, 
    $createdDate: String, 
    $likes: Int, 
    $username: String,
    $lat: Float,
    $lon: Float
  ){
    addTrip(
      name: $name
      description: $description
      category: $category
      instructions: $instructions
      createdDate: $createdDate
      likes: $likes
      username: $username
      lat: $lat
      lon: $lon
    )
    {
      _id
      name
      category
      description
      instructions
      createdDate
      likes
      username
      lat
      lon

    }
  }
`;

export const DELETE_USER_TRIP = gql`
  mutation($_id: ID!){
    deleteUserTrip(_id: $_id){
      _id
    }
  }

`;

export const LIKE_TRIP = gql`
  mutation($_id: ID!, $username: String!){
    likeTrip(_id: $_id, username: $username){
      _id
      likes
    }
  }
`;

export const UNLIKE_TRIP = gql`
  mutation($_id: ID!, $username: String!){
    unlikeTrip(_id: $_id, username: $username){
      _id
      likes
    }
  }
`;
//user queries

export const GET_CURRENT_USER = gql`
  query{
    getCurrentUser{
      username
      joinDate
      email
      favorites {
        _id
        name

      }
    }
  }
`;
export const GET_USER_TRIPS = gql`
  query($username: String!){
    getUserTrips(username: $username){
      _id
      name
      likes
    }
  }
`;

//user mutations
export const SIGNIN_USER = gql`
mutation(
  $username: String!,
  $password: String!
   ){
  signInUser(
    username: $username,
    password: $password
    ){ token }
}
`;

export const SIGNUP_USER = gql`
mutation(
    $username: String!,
    $email: String!,
    $password: String!
    ) {
    signUpUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

