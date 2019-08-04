import React from "react";
import {Mutation} from "react-apollo";
import {SIGNIN_USER} from '../../queries/index';
import Error from '../error';
import { withRouter } from 'react-router-dom';
const initialState = {
    username: "",
    password: ""
}

class Signin extends React.Component{
    state = {...initialState}
    clearState = () =>{
        this.setState({...initialState});
    }

    handleChange = (e)=>{
        const { name, value } = e.target;
        this.setState({[name]:value})
    }

    handleSubmit = (e, signInUser)=>{
        e.preventDefault();
        signInUser().then(async ({data}) => {
            console.log(data)
            localStorage.setItem('token', data.signInUser.token);
            await this.props.refetch();
            this.clearState();
            this.props.history.push('/');
        })
    }
    validateForm = () =>{
        const {username, password} = this.state;
        const isInvalid = !username || !password;
        return isInvalid;
    }
    render(){
        const {username, password} = this.state;
        return(
            <div className = "App">
                <h2 className="form">Sign In</h2>
                <Mutation mutation={SIGNIN_USER} variables={{username, password}}>
                    {(signInUser, {data, loading, error})=> {
                        return (
                            <form className="form" onSubmit={e => this.handleSubmit(e, signInUser)} >
                                <input value={username} onChange={this.handleChange} type="text" name="username" placeholder="Username"></input>
                                <input value={password} onChange={this.handleChange} type="password" name="password" placeholder="Password"></input>
                                <button disabled={loading || this.validateForm()} type="submit" className="button-primary">Submit</button>
                                {error && <Error error ={error}/>}

                            </form>
                        )
                    }}

                </Mutation>
            </div>
        )
    }
}

export default withRouter(Signin);