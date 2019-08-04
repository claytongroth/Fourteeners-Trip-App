import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './index.css';
import App from './components/App';
import NavBar from './components/NavBar';
import SignIn from './components/auth/Signin';
import SignUp from './components/auth/Signup';
import Search from './components/recipe/Search';
import AddRecipe from './components/recipe/AddRecipe';
import Profile from './components/profile/Profile';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import withSession from './components/WithSession';
import RecipePage from './components/recipe/RecipePage';
import MapPage from './components/Map';

const client = new ApolloClient({
    uri: 'http://localhost:4444/graphql',
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
            headers: {
                authorization: token
            }
        })
    },
    onError:({ networkError}) =>{
        if (networkError){
            console.log("network error", networkError);
        }
    }
})

const Root = ({ refetch, session }) => (
    <Router>
        <Fragment>
            <NavBar session={session}/>
            <Switch>
                <Route path="/" exact component={App}/>
                <Route path="/search" exact component={Search}/>
                <Route path="/map" component={MapPage}/>
                <Route path="/signin" render={()=> <SignIn refetch={refetch}/>}/>
                <Route path="/signup" render={()=> <SignUp refetch={refetch}/>}/>
                <Route path ="/recipe/add" render={()=> <AddRecipe session={session}/>}/>
                <Route path = "/recipes/:_id" component={RecipePage} />
                <Route path ="/profile" render={()=> <Profile session={session}/>}/>
                <Redirect to="/"/>
            </Switch>
        </Fragment>
    </Router>
);
const RootWithSession = withSession(Root)

ReactDOM.render(
    <ApolloProvider client={client}>
        <RootWithSession />
    </ApolloProvider>
    , document.getElementById('root')
);
