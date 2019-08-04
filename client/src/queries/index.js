import { gql } from 'apollo-boost';

//recipes queries
export const GET_ALL_RECIPES = gql`
query {
    getAllRecipes {
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
export const GET_RECIPE = gql`
  query($_id: ID!) {
    getRecipe(_id: $_id){
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

export const SEARCH_RECIPES = gql`
  query($searchTerm: String){
    searchRecipes(searchTerm: $searchTerm){
      _id
      name
      likes
    }
  }
`;

//recipe mutations
export const ADD_RECIPE = gql`
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
    addRecipe(
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

export const DELETE_USER_RECIPE = gql`
  mutation($_id: ID!){
    deleteUserRecipe(_id: $_id){
      _id
    }
  }

`;

export const LIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!){
    likeRecipe(_id: $_id, username: $username){
      _id
      likes
    }
  }
`;

export const UNLIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!){
    unlikeRecipe(_id: $_id, username: $username){
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
export const GET_USER_RECIPES = gql`
  query($username: String!){
    getUserRecipes(username: $username){
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

