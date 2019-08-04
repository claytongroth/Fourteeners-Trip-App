import React from 'react';
import { Query, Mutation } from 'react-apollo';
import {GET_USER_RECIPES, GET_ALL_RECIPES, DELETE_USER_RECIPE, GET_CURRENT_USER} from '../../queries';
import { Link } from 'react-router-dom';

const handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm("Sure you want to delete?");
    if (confirmDelete){
        deleteUserRecipe().then(({data})=>{
            console.log(data);
        })
    }
}

const UserRecipes = ({username}) =>(
    <Query query={GET_USER_RECIPES} variables={{username}}>
        {({data, loading, error})=>{
            if (loading) return <div>Loading...</div>
            if (error) return <div>Error...</div>
            return (
                <ul>
                    <h3>Your Trip Reports</h3>
                    {!data.getUserRecipes.length && <p><strong>You have not added any recipes yet!</strong></p>}
                    {data.getUserRecipes.map(recipe =>
                        <li key ={recipe._id}>
                            <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
                            <p style={{marginBottom: "0"}}>Likes: {recipe.likes}</p>
                            <Mutation 
                                mutation={DELETE_USER_RECIPE} 
                                variables={{_id: recipe.id}}
                                refetchQueries ={()=>[
                                    {query: GET_ALL_RECIPES},
                                    {query: GET_CURRENT_USER}
                                ]}
                                update={(cache,{data: {deleteUserRecipe}})=>{
                                    const {getUserRecipes} = cache.readQuery({
                                        query: GET_USER_RECIPES,
                                        variables: {username}
                                    })
                                    cache.writeQuery({
                                        query: GET_USER_RECIPES,
                                        variables: {username},
                                        data: {
                                            getUserRecipes: getUserRecipes.filter(
                                                recipe => recipe._id !== deleteUserRecipe._id
                                            )
                                        }
                                    })
                                }}
                            >
                                {(deleteUserRecipe, attrs={}) =>{
                                    return (
                                        <p  
                                            onClick={()=> handleDelete(deleteUserRecipe)} 
                                            className="delete-button">{attrs.loading? 'deleting record...': 'X'}
                                        
                                        </p>
                                    )
                                }}
                            </Mutation>
                        </li>
                    )}
                </ul>
            )
        }}
    </Query>
);

 
export default UserRecipes;